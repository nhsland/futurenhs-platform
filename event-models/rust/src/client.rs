use crate::Event;
use opentelemetry::{
    api::{Context, FutureExt, KeyValue, SpanKind, TraceContextExt, Tracer},
    global as otel,
};

#[derive(Debug, Clone)]
pub struct Client {
    url: String,
    key: String,
}

impl Client {
    pub fn new(topic_endpoint: String, topic_key: String) -> Self {
        Self {
            url: format!(
                "https://{}/api/events?api-version=2018-01-01",
                topic_endpoint
            ),
            key: topic_key,
        }
    }

    /// Publish events to Azure EventGrid.
    ///
    /// See also: https://docs.microsoft.com/en-us/rest/api/eventgrid/dataplane/publishevents/publishevents
    pub async fn publish_events(&self, events: &[Event]) -> Result<(), PublishEventsError> {
        let tracer = otel::tracer("fnhs_event_models");
        let span = tracer
            .span_builder("POST /api/events")
            .with_kind(SpanKind::Client)
            .with_attributes(vec![
                KeyValue::new("http.method", "POST"),
                KeyValue::new("http.url", self.url.as_str()),
            ])
            .start(&tracer);
        let cx = Context::current_with_span(span);

        let res = surf::post(&self.url)
            .set_header("aeg-sas-key", &self.key)
            .body_json(&events)?
            .with_context(cx.clone())
            .await?;

        cx.span().set_attribute(KeyValue::new(
            "http.status_code",
            i64::from(res.status().as_u16()),
        ));
        if let Some(status_text) = res.status().canonical_reason() {
            cx.span()
                .set_attribute(KeyValue::new("http.status_text", status_text));
        }

        if res.status() == 200 {
            Ok(())
        } else {
            Err(PublishEventsError::Server(res.status().as_u16()))
        }
    }
}

#[derive(Debug)]
pub enum PublishEventsError {
    Internal(String),
    Server(u16),
}

impl From<serde_json::Error> for PublishEventsError {
    fn from(err: serde_json::Error) -> Self {
        Self::Internal(format!("{}", err))
    }
}

impl From<surf::Exception> for PublishEventsError {
    fn from(err: surf::Exception) -> Self {
        Self::Internal(format!("{}", err))
    }
}

impl std::error::Error for PublishEventsError {}

impl std::fmt::Display for PublishEventsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Internal(err) => write!(f, "Internal: {}", err),
            Self::Server(status) => write!(f, "Server: {}", status),
        }
    }
}
