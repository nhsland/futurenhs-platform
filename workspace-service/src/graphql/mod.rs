mod folders;
mod workspaces;

use super::db;
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, GQLMergedObject, Schema,
};
use sqlx::PgPool;
use tide::{http::mime, Request, Response, StatusCode};

#[derive(Clone)]
pub struct State {
    schema: Schema<Query, Mutation, EmptySubscription>,
    event_client: fnhs_event_models::BoxedClient,
}

impl State {
    pub fn new(pool: PgPool, event_client: fnhs_event_models::BoxedClient) -> State {
        State {
            schema: Schema::build(Query::default(), Mutation::default(), EmptySubscription)
                .data(pool)
                .finish(),
            event_client,
        }
    }
}

#[derive(GQLMergedObject, Default)]
struct Query(folders::FoldersQuery, workspaces::WorkspacesQuery);

#[derive(GQLMergedObject, Default)]
struct Mutation(folders::FoldersMutation, workspaces::WorkspacesMutation);

pub async fn handle_healthz(req: Request<State>) -> tide::Result {
    let response = if !req.state().event_client.is_valid() {
        Response::builder(500).body("invalid event client").build()
    } else {
        Response::new(204)
    };

    Ok(response)
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
