use super::db;
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    Context, EmptySubscription, FieldResult, InputObject, Object, Schema, SimpleObject, ID,
};
use sqlx::PgPool;
use tide::{http::mime, Request, Response, StatusCode};
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

#[SimpleObject(desc = "A folder")]
pub struct Folder {
    #[field(desc = "The id of the folder")]
    id: ID,
    #[field(desc = "The title of the folder")]
    title: String,
    #[field(desc = "The description of the folder")]
    description: String,
    #[field(desc = "The workspace that this folder is in")]
    workspace: ID,
}

impl From<db::Folder> for Folder {
    fn from(d: db::Folder) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
            workspace: d.workspace.into(),
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

#[InputObject]
struct NewFolder {
    title: String,
    description: String,
    workspace: ID,
}

#[InputObject]
struct UpdateFolder {
    title: String,
    description: String,
}

#[derive(Clone)]
pub struct State {
    pub schema: Schema<Query, Mutation, EmptySubscription>,
}

impl State {
    pub fn new(pool: PgPool) -> State {
        State {
            schema: Schema::build(Query, Mutation, EmptySubscription)
                .data(pool)
                .finish(),
        }
    }
}

pub struct Query;

#[Object]
impl Query {
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

    #[field(desc = "Get all Folders in a workspace")]
    async fn folders_by_workspace(
        &self,
        context: &Context<'_>,
        workspace: ID,
    ) -> FieldResult<Vec<Folder>> {
        let pool = context.data()?;
        let workspace = Uuid::parse_str(workspace.as_str())?;
        let folders = db::Folder::find_by_workspace(workspace, pool).await?;
        Ok(folders.into_iter().map(Into::into).collect())
    }

    #[field(desc = "Get folder by ID")]
    async fn folder(&self, context: &Context<'_>, id: ID) -> FieldResult<Folder> {
        self.get_folder(context, id).await
    }

    #[entity]
    async fn get_folder(&self, context: &Context<'_>, id: ID) -> FieldResult<Folder> {
        let pool = context.data()?;
        let id = Uuid::parse_str(id.as_str())?;
        let folder = db::Folder::find_by_id(id, pool).await?;
        Ok(folder.into())
    }
}

pub struct Mutation;

#[Object]
impl Mutation {
    #[field(desc = "Create a new workspace (returns the created workspace)")]
    async fn create_workspace(
        &self,
        context: &Context<'_>,
        workspace: NewWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let workspace =
            db::Workspace::create(workspace.title, workspace.description, pool).await?;
        Ok(workspace.into())
    }

    #[field(desc = "Update workspace (returns updated workspace")]
    async fn update_workspace(
        &self,
        context: &Context<'_>,
        id: ID,
        workspace: UpdateWorkspace,
    ) -> FieldResult<Workspace> {
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
        let pool = context.data()?;
        let workspace = db::Workspace::delete(Uuid::parse_str(id.as_str())?, pool).await?;

        Ok(workspace.into())
    }

    #[field(desc = "Create a new folder (returns the created folder)")]
    async fn create_folder(&self, context: &Context<'_>, folder: NewFolder) -> FieldResult<Folder> {
        let pool = context.data()?;
        let workspace = Uuid::parse_str(folder.workspace.as_str())?;
        let folder =
            db::Folder::create(folder.title, folder.description, workspace, pool).await?;
        Ok(folder.into())
    }

    #[field(desc = "Update folder (returns updated folder")]
    async fn update_folder(
        &self,
        context: &Context<'_>,
        id: ID,
        folder: UpdateFolder,
    ) -> FieldResult<Folder> {
        let pool = context.data()?;
        let folder = db::Folder::update(
            Uuid::parse_str(id.as_str())?,
            folder.title,
            folder.description,
            pool,
        )
        .await?;

        Ok(folder.into())
    }

    #[field(desc = "Delete folder (returns deleted folder")]
    async fn delete_folder(&self, context: &Context<'_>, id: ID) -> FieldResult<Folder> {
        let pool = context.data()?;
        let folder = db::Folder::delete(Uuid::parse_str(id.as_str())?, pool).await?;

        Ok(folder.into())
    }
}

pub async fn handle_graphql(req: Request<State>) -> tide::Result {
    let schema = req.state().schema.clone();
    async_graphql_tide::graphql(req, schema, |query_builder| query_builder).await
}

pub async fn handle_graphiql(_: Request<State>) -> tide::Result {
    let response = Response::builder(StatusCode::Ok)
        .body(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
        .content_type(mime::HTML)
        .build();

    Ok(response)
}
