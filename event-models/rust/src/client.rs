use crate::Event;
use async_trait::async_trait;
use std::sync::{mpsc::SyncSender, Arc};
use tracing::info_span;
use tracing_futures::Instrument as _;

#[async_trait]
pub trait EventPublisher: std::fmt::Debug {
    async fn publish_events<'a>(&'a self, events: &'a [Event]) -> Result<(), PublishEventsError>;
}

#[derive(Debug, Clone)]
pub struct EventClient {
    publisher: Arc<dyn EventPublisher + Send + Sync>,
    is_configured: bool,
}

impl EventClient {
    pub fn new(topic_hostname: String, topic_key: String) -> Self {
        EventClient {
            publisher: Arc::new(EventGridPublisher {
                url: format!(
                    "https://{}/api/events?api-version=2018-01-01",
                    topic_hostname
                ),
                key: topic_key,
            }),
            is_configured: true,
        }
    }

    pub fn is_configured(&self) -> bool {
        self.is_configured
    }

    pub fn with_publisher(publisher: Arc<dyn EventPublisher + Send + Sync>) -> Self {
        EventClient {
            publisher,
            is_configured: false,
        }
    }
}

impl Default for EventClient {
    fn default() -> Self {
        EventClient {
            publisher: Arc::new(NoopPublisher {}),
            is_configured: false,
        }
    }
}

#[async_trait]
impl EventPublisher for EventClient {
    async fn publish_events<'a>(&'a self, events: &'a [Event]) -> Result<(), PublishEventsError> {
        self.publisher.publish_events(events).await
    }
}

// Helper for tests.
#[async_trait]
impl EventPublisher for SyncSender<Event> {
    async fn publish_events<'a>(&'a self, events: &'a [Event]) -> Result<(), PublishEventsError> {
        for event in events {
            self.send(event.clone()).unwrap();
        }
        Ok(())
    }
}

#[derive(Debug)]
struct EventGridPublisher {
    url: String,
    key: String,
}

#[async_trait]
impl EventPublisher for EventGridPublisher {
    /// Publish events to Azure EventGrid.
    ///
    /// See also: https://docs.microsoft.com/en-us/rest/api/eventgrid/dataplane/publishevents/publishevents
    async fn publish_events<'a>(&'a self, events: &'a [Event]) -> Result<(), PublishEventsError> {
        let span = info_span!(
            "POST /api/events",
            otel.kind = "client",
            http.method = "GET",
            http.url = self.url.as_str(),
            http.status_code = tracing::field::Empty,
            http.status_text = tracing::field::Empty
        );

        let res = surf::post(&self.url)
            .header("aeg-sas-key", self.key.as_str())
            .body(surf::Body::from_json(&events)?)
            .instrument(span.clone())
            .await?;

        span.record("http.status_code", &u16::from(res.status()));

        if res.status() == 200 {
            Ok(())
        } else {
            Err(PublishEventsError::Server(u16::from(res.status())))
        }
    }
}

#[derive(Debug)]
struct NoopPublisher {}

#[async_trait]
impl EventPublisher for NoopPublisher {
    async fn publish_events<'a>(&'a self, _events: &'a [Event]) -> Result<(), PublishEventsError> {
        Ok(())
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

impl From<surf::Error> for PublishEventsError {
    fn from(err: surf::Error) -> Self {
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
