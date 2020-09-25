use crate::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use fnhs_event_models::{Event, EventClient, EventPublisher as _, WorkspaceCreatedData};
use sqlx::PgPool;
use uuid::Uuid;

#[SimpleObject(desc = "A workspace")]
pub struct Workspace {
    #[field(desc = "The id of the workspace")]
    id: ID,
    #[field(desc = "The title of the workspace")]
    title: String,
    #[field(desc = "The description of the workspace")]
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

#[InputObject]
struct NewWorkspace {
    title: String,
    description: String,
}

#[InputObject]
struct UpdateWorkspace {
    title: String,
    description: String,
}

#[derive(Default)]
pub struct WorkspacesQuery;

#[Object]
impl WorkspacesQuery {
    #[field(desc = "Get all Workspaces")]
    async fn workspaces(&self, context: &Context<'_>) -> FieldResult<Vec<Workspace>> {
        let pool = context.data()?;
        let workspaces = db::Workspace::find_all(pool).await?;
        Ok(workspaces.into_iter().map(Into::into).collect())
    }

    #[field(desc = "Get workspace by ID")]
    async fn workspace(&self, context: &Context<'_>, id: ID) -> FieldResult<Workspace> {
        self.get_workspace(context, id).await
    }

    #[entity]
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
    #[field(desc = "Create a new workspace (returns the created workspace)")]
    async fn create_workspace(
        &self,
        context: &Context<'_>,
        new_workspace: NewWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let event_client: &EventClient = context.data()?;
        create_workspace(
            &new_workspace.title,
            &new_workspace.description,
            pool,
            event_client,
        )
        .await
    }

    #[field(desc = "Update workspace (returns updated workspace")]
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

    #[field(desc = "Delete workspace(returns deleted workspace")]
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
    pool: &PgPool,
    event_client: &EventClient,
) -> FieldResult<Workspace> {
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
    use crate::graphql::test_helpers::*;
    use fnhs_event_models::EventData;

    #[async_std::test]
    async fn creating_workspace_emits_an_event() -> anyhow::Result<()> {
        let pool = mock_connection_pool().await?;
        let (events, event_client) = mock_event_emitter();

        let workspace = create_workspace("title", "description", &pool, &event_client)
            .await
            .unwrap();

        assert_eq!(workspace.title, "title");
        assert_eq!(workspace.description, "description");

        assert!(events
            .try_iter()
            .any(|e| matches!(e.data, EventData::WorkspaceCreated(_))));

        Ok(())
    }
}
