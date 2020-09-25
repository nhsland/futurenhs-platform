use fnhs_event_models::Event;
use fnhs_event_models::EventClient;
use sqlx::PgPool;
use std::sync::mpsc::{sync_channel, Receiver};
use std::sync::Arc;

/// Should explode if you actually try to use it.
pub async fn mock_connection_pool() -> anyhow::Result<PgPool> {
    let database_url = "postgresql://COMPLETELY_BOGUS_DB_URL";
    let connection_pool = PgPool::connect(&database_url).await?;
    Ok(connection_pool)
}

/// Returns an EventClient and a channel to see what was published.
pub fn mock_event_emitter() -> (Receiver<Event>, EventClient) {
    let (sender, receiver) = sync_channel(1000);
    (receiver, EventClient::with_publisher(Arc::new(sender)))
}
