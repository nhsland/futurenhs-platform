use fnhs_event_models::EventClient;
use sqlx::PgPool;
use std::future::Future;
use std::pin::Pin;
use tide::{Next, Redirect, Request, Server};
use tracing::info_span;
use tracing_futures::Instrument;

mod db;
mod graphql;

pub fn log<'a>(
    req: Request<graphql::State>,
    next: Next<'a, graphql::State>,
) -> Pin<Box<dyn Future<Output = Result<tide::Response, http_types::Error>> + Send + 'a>> {
    Box::pin(async {
        let span = info_span!(
            "request",
            otel.kind = "server",
            http.status_code = tracing::field::Empty,
            http.method = req.method().as_ref(),
            http.target = req.url().as_ref()
        );

        let res = next.run(req).instrument(span.clone()).await;
        span.record("http.status_code", &u16::from(res.status()));

        Ok(res)
    })
}

pub async fn create_app(
    connection_pool: PgPool,
    event_client: EventClient,
) -> anyhow::Result<Server<graphql::State>> {
    let mut app = tide::with_state(graphql::State::new(connection_pool, event_client));

    app.with(log);

    app.at("/").get(Redirect::permanent("/graphiql"));
    app.at("/healthz").get(graphql::handle_healthz);
    app.at("/graphql").post(graphql::handle_graphql);
    app.at("/graphiql").get(graphql::handle_graphiql);

    Ok(app)
}
