use crate::db;
use crate::events::create_workspace;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use fnhs_event_models::{
    CreateWorkspaceEventData, CreateWorkspaceEventDataInput, CreateWorkspaceEventDataInputOutput,
    Event, EventClient, EventData, EventPublisher as _,
};
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

impl From<CreateWorkspaceEventDataInputOutput> for Workspace {
    fn from(output: CreateWorkspaceEventDataInputOutput) -> Self {
        Self {
            id: output.id.into(),
            title: output.title,
            description: output.description,
        }
    }
}

#[InputObject]
struct NewWorkspace {
    title: String,
    description: String,
}

impl From<NewWorkspace> for CreateWorkspaceEventDataInput {
    fn from(workspace: NewWorkspace) -> Self {
        Self {
            title: workspace.title,
            description: workspace.description,
        }
    }
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
        workspace: NewWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let event_client: &EventClient = context.data()?;

        let input: CreateWorkspaceEventDataInput = workspace.into();
        let output = create_workspace(input.clone(), pool).await?;
        let workspace: Workspace = output.clone().into();
        event_client
            .publish_events(&[Event::new(
                workspace.id.clone(),
                EventData::CreateWorkspace(CreateWorkspaceEventData { input, output }),
            )])
            .await?;

        Ok(workspace)
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
            workspace.title,
            workspace.description,
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
