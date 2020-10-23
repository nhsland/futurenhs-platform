use super::azure;
use fnhs_event_models::Event;
use fnhs_event_models::EventClient;
use sqlx::PgPool;
use std::sync::mpsc::{sync_channel, Receiver};
use std::sync::Arc;
use url::Url;
use uuid::Uuid;

use super::RequestingUser;

/// Should explode if you actually try to use it.
pub fn mock_connection_pool() -> anyhow::Result<PgPool> {
    let database_url = "postgresql://COMPLETELY_BOGUS_DB_URL";
    let connection_pool = PgPool::connect_lazy(&database_url)?;
    Ok(connection_pool)
}

/// Returns an EventClient and a channel to see what was published.
pub fn mock_event_emitter() -> (Receiver<Event>, EventClient) {
    let (sender, receiver) = sync_channel(1000);
    (receiver, EventClient::with_publisher(Arc::new(sender)))
}

pub fn mock_admin_requesting_user() -> RequestingUser {
    RequestingUser {
        auth_id: Uuid::parse_str("feedface-0000-0000-0000-000000000000").unwrap(),
    }
}

pub fn mock_unprivileged_requesting_user() -> RequestingUser {
    RequestingUser {
        auth_id: Uuid::parse_str("deadbeef-0000-0000-0000-000000000000").unwrap(),
    }
}

pub fn mock_azure_config() -> anyhow::Result<azure::Config> {
    Ok(azure::Config {
        access_key: "fake key".into(),
        upload_container_url: Url::parse("http://localhost:10000/devstoreaccount1/upload")?,
        files_container_url: Url::parse("http://localhost:10000/devstoreaccount1/files")?,
    })
}
