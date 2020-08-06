use super::db;
use async_graphql::{
    Context, EmptySubscription, FieldResult, InputObject, Object, Schema, SimpleObject, ID,
};
use sqlx::PgPool;
use tide::Request;
use uuid::Uuid;

#[SimpleObject(desc = "A workspace")]
pub struct Workspace {
    #[field(desc = "The id of the workspace")]
    id: ID,
    #[field(desc = "The title of the workspace")]
    title: String,
}

impl From<db::Workspace> for Workspace {
    fn from(d: db::Workspace) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
        }
    }
}

#[InputObject]
struct NewWorkspace {
    title: String,
}

#[derive(Clone)]
pub struct State {
    pub schema: Schema<QueryRoot, MutationRoot, EmptySubscription>,
}

impl State {
    pub fn new(pool: PgPool) -> State {
        State {
            schema: Schema::build(QueryRoot, MutationRoot, EmptySubscription)
                .data(pool)
                .finish(),
        }
    }
}

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    #[field(desc = "Get all Workspaces")]
    async fn workspaces(&self, context: &Context<'_>) -> FieldResult<Vec<Workspace>> {
        let pool = context.data()?;
        let workspaces = db::Workspace::find_all(pool).await?;
        Ok(workspaces.iter().cloned().map(Into::into).collect())
    }

    #[field(desc = "Get Workspace by id")]
    async fn workspace(&self, context: &Context<'_>, id: ID) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let id = Uuid::parse_str(id.as_str())?;
        let workspace = db::Workspace::find_by_id(id, pool).await?;
        Ok(workspace.into())
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    #[field(desc = "Create a new workspace (returns the created workspace)")]
    async fn create_workspace(
        &self,
        context: &Context<'_>,
        workspace: NewWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let workspace = db::Workspace::create(workspace.title, pool).await?;
        Ok(workspace.into())
    }
}

pub async fn handle_graphql(req: Request<State>) -> tide::Result {
    let schema = req.state().schema.clone();
    async_graphql_tide::graphql(req, schema, |query_builder| query_builder).await
}
