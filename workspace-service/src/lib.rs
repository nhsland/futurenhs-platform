pub mod azure;
pub mod config;
mod db;
mod graphql;

use fnhs_event_models::EventClient;
pub use graphql::generate_graphql_schema;
use opentelemetry::api::Extractor;
use sqlx::PgPool;
use std::future::Future;
use std::pin::Pin;
use tide::{Next, Redirect, Request, Server};
use tracing::info_span;
use tracing_futures::Instrument;
use tracing_opentelemetry::OpenTelemetrySpanExt;

struct RequestExtractor<'a> {
    req: &'a Request<graphql::State>,
}

impl<'a> Extractor for RequestExtractor<'a> {
    /// Get a value for a key from the HeaderMap.  If the value is not valid ASCII, returns None.
    fn get(&self, key: &str) -> Option<&str> {
        self.req.header(key).map(|value| value.as_str())
    }
}

pub fn log<'a>(
    req: Request<graphql::State>,
    next: Next<'a, graphql::State>,
) -> Pin<Box<dyn Future<Output = Result<tide::Response, http_types::Error>> + Send + 'a>> {
    Box::pin(async {
        let remote_context = opentelemetry::global::get_http_text_propagator(|propagator| {
            propagator.extract(&RequestExtractor { req: &req })
        });

        let span = info_span!(
            "request",
            otel.kind = "server",
            http.status_code = tracing::field::Empty,
            http.method = req.method().as_ref(),
            http.target = req.url().as_ref()
        );
        span.set_parent(&remote_context);

        let res = next.run(req).instrument(span.clone()).await;
        span.record("http.status_code", &u16::from(res.status()));

        Ok(res)
    })
}

pub async fn create_app(
    connection_pool: PgPool,
    event_client: EventClient,
    azure_config: azure::Config,
) -> anyhow::Result<Server<graphql::State>> {
    let mut app = tide::with_state(graphql::State::new(
        connection_pool,
        event_client,
        azure_config,
    ));

    app.with(log);

    app.at("/").get(Redirect::permanent("/graphiql"));
    app.at("/healthz").get(graphql::handle_healthz);
    app.at("/graphql").post(graphql::handle_graphql);
    app.at("/graphiql").get(graphql::handle_graphiql);

    Ok(app)
}
