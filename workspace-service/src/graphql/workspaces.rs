use crate::db;
use crate::graphql::RequestingUser;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use fnhs_event_models::{Event, EventClient, EventPublisher as _, WorkspaceCreatedData};
use sqlx::PgPool;
use uuid::Uuid;

/// A workspace
#[derive(SimpleObject)]
pub struct Workspace {
    /// The id of the workspace
    id: ID,
    /// The title of the workspace
    title: String,
    /// The description of the workspace
    description: String,
}

impl From<db::Workspace> for Workspace {
    fn from(d: db::Workspace) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
        }
    }
}

#[derive(InputObject)]
struct NewWorkspace {
    title: String,
    description: String,
}

#[derive(InputObject)]
struct UpdateWorkspace {
    title: String,
    description: String,
}

#[derive(Default)]
pub struct WorkspacesQuery;

#[Object]
impl WorkspacesQuery {
    /// Get all Workspaces
    async fn workspaces(&self, context: &Context<'_>) -> FieldResult<Vec<Workspace>> {
        let pool = context.data()?;
        let workspaces = db::Workspace::find_all(pool).await?;
        Ok(workspaces.into_iter().map(Into::into).collect())
    }

    /// Get workspace by ID
    async fn workspace(&self, context: &Context<'_>, id: ID) -> FieldResult<Workspace> {
        self.get_workspace(context, id).await
    }

    #[graphql(entity)]
    async fn get_workspace(&self, context: &Context<'_>, id: ID) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let id = Uuid::parse_str(id.as_str())?;
        let workspace = db::Workspace::find_by_id(id, pool).await?;
        Ok(workspace.into())
    }
}

#[derive(Default)]
pub struct WorkspacesMutation;

#[Object]
impl WorkspacesMutation {
    /// Create a new workspace (returns the created workspace)
    async fn create_workspace(
        &self,
        context: &Context<'_>,
        new_workspace: NewWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let event_client: &EventClient = context.data()?;
        let requesting_user = context.data::<super::RequestingUser>()?;

        create_workspace(
            &new_workspace.title,
            &new_workspace.description,
            requesting_user,
            pool,
            event_client,
        )
        .await
    }

    /// Update workspace (returns updated workspace
    async fn update_workspace(
        &self,
        context: &Context<'_>,
        id: ID,
        workspace: UpdateWorkspace,
    ) -> FieldResult<Workspace> {
        // TODO: Add event
        let pool = context.data()?;
        let workspace = db::Workspace::update(
            Uuid::parse_str(id.as_str())?,
            &workspace.title,
            &workspace.description,
            pool,
        )
        .await?;

        Ok(workspace.into())
    }

    /// Delete workspace(returns deleted workspace
    async fn delete_workspace(&self, context: &Context<'_>, id: ID) -> FieldResult<Workspace> {
        // TODO: Add event
        let pool = context.data()?;
        let workspace = db::Workspace::delete(Uuid::parse_str(id.as_str())?, pool).await?;

        Ok(workspace.into())
    }
}

async fn create_workspace(
    title: &str,
    description: &str,
    requesting_user: &RequestingUser,
    pool: &PgPool,
    event_client: &EventClient,
) -> FieldResult<Workspace> {
    let user = db::User::find_by_auth_id(&requesting_user.auth_id, pool).await?;
    if !user.is_platform_admin {
        return Err(anyhow::anyhow!(
            "User with auth_id {} does not have permission to create a workspace.",
            requesting_user.auth_id,
        )
        .into());
    }

    let workspace: Workspace = db::Workspace::create(title, description, pool)
        .await?
        .into();

    event_client
        .publish_events(&[Event::new(
            workspace.id.clone(),
            WorkspaceCreatedData {
                workspace_id: workspace.id.clone().into(),
                // TODO: Fill this in when we have users in the db.
                user_id: "".into(),
                title: workspace.title.clone(),
            },
        )])
        .await?;

    Ok(workspace)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::graphql::test_mocks::*;
    use fnhs_event_models::EventData;

    #[async_std::test]
    async fn creating_workspace_emits_an_event() -> anyhow::Result<()> {
        let pool = mock_connection_pool()?;
        let (events, event_client) = mock_event_emitter();

        let workspace = create_workspace(
            "title",
            "description",
            &mock_admin_requesting_user(),
            &pool,
            &event_client,
        )
        .await
        .unwrap();

        assert_eq!(workspace.title, "title");
        assert_eq!(workspace.description, "description");

        assert!(events
            .try_iter()
            .any(|e| matches!(e.data, EventData::WorkspaceCreated(_))));

        Ok(())
    }

    #[async_std::test]
    async fn creating_workspace_as_non_admin_fails() -> anyhow::Result<()> {
        let pool = mock_connection_pool()?;
        let (events, event_client) = mock_event_emitter();

        let result = create_workspace(
            "title",
            "description",
            &mock_unprivileged_requesting_user(),
            &pool,
            &event_client,
        )
        .await;

        assert_eq!(result.err().unwrap().message, "User with auth_id deadbeef-0000-0000-0000-000000000000 does not have permission to create a workspace.");

        assert_eq!(events.try_iter().collect::<Vec<_>>().len(), 0);

        Ok(())
    }
}
