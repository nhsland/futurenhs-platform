mod file_uploads;
mod files;
mod folders;
#[cfg(test)]
mod test_mocks;
mod workspaces;

use super::db;
use super::sas;
use async_graphql::{
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptySubscription, GQLMergedObject, Schema,
};
use fnhs_event_models::EventClient;
use sqlx::PgPool;
use tide::{http::mime, Request, Response, StatusCode};

#[derive(Clone)]
pub struct State {
    schema: Schema<Query, Mutation, EmptySubscription>,
    event_client: EventClient,
}

impl State {
    pub fn new(pool: PgPool, event_client: EventClient, sas_config: sas::Config) -> State {
        State {
            schema: Schema::build(Query::default(), Mutation::default(), EmptySubscription)
                .data(pool)
                .data(event_client.clone())
                .data(sas_config)
                .finish(),
            event_client,
        }
    }
}

#[derive(GQLMergedObject, Default)]
struct Query(
    files::FilesQuery,
    folders::FoldersQuery,
    workspaces::WorkspacesQuery,
    file_uploads::FileUploadQuery,
);

#[derive(GQLMergedObject, Default)]
struct Mutation(
    folders::FoldersMutation,
    workspaces::WorkspacesMutation,
    files::FilesMutation,
);

pub async fn handle_healthz(req: Request<State>) -> tide::Result {
    let response = if !req.state().event_client.is_configured() {
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
