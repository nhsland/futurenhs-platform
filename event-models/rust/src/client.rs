use crate::Event;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;
use tracing::info_span;
use tracing_futures::Instrument as _;

pub trait Client: std::fmt::Debug {
    fn publish_events<'a>(
        &'a self,
        events: &'a [Event],
    ) -> Pin<Box<dyn Future<Output = Result<(), PublishEventsError>> + Send + 'a>>;
}

#[derive(Debug, Clone)]
pub struct BoxedClient {
    client: Arc<dyn Client + Send + Sync>,
    is_valid: bool,
}

impl BoxedClient {
    pub fn new(topic_hostname: String, topic_key: String) -> Self {
        BoxedClient {
            client: Arc::new(DefaultClient {
                url: format!(
                    "https://{}/api/events?api-version=2018-01-01",
                    topic_hostname
                ),
                key: topic_key,
            }),
            is_valid: true,
        }
    }

    pub fn noop() -> Self {
        BoxedClient {
            client: Arc::new(NoopClient {}),
            is_valid: false,
        }
    }

    pub fn is_valid(&self) -> bool {
        self.is_valid
    }
}

impl Client for BoxedClient {
    fn publish_events<'a>(
        &'a self,
        events: &'a [Event],
    ) -> Pin<Box<dyn Future<Output = Result<(), PublishEventsError>> + Send + 'a>> {
        self.client.publish_events(events)
    }
}

#[derive(Debug)]
struct DefaultClient {
    url: String,
    key: String,
}

impl Client for DefaultClient {
    /// Publish events to Azure EventGrid.
    ///
    /// See also: https://docs.microsoft.com/en-us/rest/api/eventgrid/dataplane/publishevents/publishevents
    fn publish_events<'a>(
        &'a self,
        events: &'a [Event],
    ) -> Pin<Box<dyn Future<Output = Result<(), PublishEventsError>> + Send + 'a>> {
        Box::pin(async move {
            let span = info_span!(
                "POST /api/events",
                otel.kind = "client",
                http.method = "GET",
                http.url = self.url.as_str(),
                http.status_code = tracing::field::Empty,
                http.status_text = tracing::field::Empty
            );

            let res = surf::post(&self.url)
                .set_header("aeg-sas-key", &self.key)
                .body_json(&events)?
                .instrument(span.clone())
                .await?;

            span.record("http.status_code", &res.status().as_u16());
            if let Some(status_text) = res.status().canonical_reason() {
                span.record("http.status_text", &status_text);
            }

            if res.status() == 200 {
                Ok(())
            } else {
                Err(PublishEventsError::Server(res.status().as_u16()))
            }
        })
    }
}

#[derive(Debug)]
struct NoopClient {}

impl Client for NoopClient {
    fn publish_events<'a>(
        &'a self,
        _events: &'a [Event],
    ) -> Pin<Box<dyn Future<Output = Result<(), PublishEventsError>> + Send + 'a>> {
        Box::pin(async move { Ok(()) })
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
