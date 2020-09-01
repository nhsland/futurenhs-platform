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
    long_description: String,
}

impl From<db::Workspace> for Workspace {
    fn from(d: db::Workspace) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            long_description: d.long_description,
        }
    }
}

#[InputObject]
struct NewWorkspace {
    title: String,
    long_description: String,
}

#[InputObject]
struct UpdateWorkspace {
    title: String,
    long_description: String,
}

#[derive(Clone)]
pub struct State {
    pub schema: Schema<Query, MutationRoot, EmptySubscription>,
}

impl State {
    pub fn new(pool: PgPool) -> State {
        State {
            schema: Schema::build(Query, MutationRoot, EmptySubscription)
                .data(pool)
                .finish(),
        }
    }
}

pub struct Query;

#[Object(extends)]
impl Query {
    // #[field(description = "Get all Workspaces")]
    async fn workspaces(&self, context: &Context<'_>) -> FieldResult<Vec<Workspace>> {
        let pool = context.data()?;
        let workspaces = db::Workspace::find_all(pool).await?;
        Ok(workspaces.into_iter().map(Into::into).collect())
    }

    // FIXME: Unable to get the enable_federation method to work on the schema, hence this is here.
    #[entity]
    async fn workspace(&self, context: &Context<'_>,id: ID) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let id = Uuid::parse_str(id.as_str())?;
        let workspace = db::Workspace::find_by_id(id, pool).await?;
        Ok(workspace.into())
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    #[field(description = "Create a new workspace (returns the created workspace)")]
    async fn create_workspace(
        &self,
        context: &Context<'_>,
        workspace: NewWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let workspace = db::Workspace::create(workspace.title, workspace.long_description, pool).await?;
        Ok(workspace.into())
    }

    #[field(description = "Update workspace(returns updated workspace")]
    async fn update_workspace(
        &self,
        context: &Context<'_>,
        id: ID,
        workspace: UpdateWorkspace,
    ) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let workspace =
            db::Workspace::update(Uuid::parse_str(id.as_str())?, workspace.title, workspace.long_description, pool).await?;

        Ok(workspace.into())
    }

    #[field(description = "Delete workspace(returns deleted workspace")]
    async fn delete_workspace(&self, context: &Context<'_>, id: ID) -> FieldResult<Workspace> {
        let pool = context.data()?;
        let workspace = db::Workspace::delete(Uuid::parse_str(id.as_str())?, pool).await?;

        Ok(workspace.into())
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
