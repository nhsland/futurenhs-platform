use async_graphql::extensions::{Extension, ExtensionContext, ExtensionFactory};
use async_graphql::{ServerError, Variables};
use tracing::{span, Level, Span};

#[derive(Default)]
pub struct Tracing;

impl ExtensionFactory for Tracing {
    fn create(&self) -> Box<dyn Extension> {
        Box::new(TracingExtension::default())
    }
}

#[derive(Default)]
struct TracingExtension {
    root: Option<Span>,
}

impl Extension for TracingExtension {
    fn parse_start(
        &mut self,
        _ctx: &ExtensionContext<'_>,
        query_source: &str,
        _variables: &Variables,
    ) {
        let root_span = span!(
            target: "async_graphql::graphql",
            Level::INFO,
            "query",
            source = %query_source
        );

        root_span.with_subscriber(|(id, d)| d.enter(id));
        self.root.replace(root_span);
    }

    fn error(&mut self, _ctx: &ExtensionContext<'_>, err: &ServerError) {
        tracing::error!(target: "async_graphql::graphql", error = %err.message);

        self.root
            .take()
            .and_then(|span| span.with_subscriber(|(id, d)| d.exit(id)));
    }
}
