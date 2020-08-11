use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

schemafy::schemafy!(
    root: Event
    "../schema.json"
);

// Adjacently tagged enum, which is flattened in the main event struct comes close.
// But it's still missing the dataVersion
// Maybe a custom struct serialization can help: https://serde.rs/deserialize-struct.html
// But is that too much?
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "eventType", content = "data")]
enum CustomEventData {
    #[serde(rename = "loggedin")]
    LoggedIn(LoggedInEventData),
    #[serde(rename = "loggedin")]
    LoggedInV2(LoggedInEventV2Data),
    #[serde(rename = "loginfailed")]
    LoginFailed(LoginFailedEventData),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CustomEvent {
    pub id: String,
    pub subject: String,
    pub event_time: DateTime<Utc>,
    #[serde(flatten)]
    pub data: CustomEventData,
}

pub fn parse() -> Result<Event, Box<dyn std::error::Error>> {
    let event: Event =
        serde_json::from_str(r#"{ "eventTime": "2020", "id": "1", "subject": "anonymous" }"#)?;
    Ok(event)
}

pub fn custom_parse() -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "{}",
        serde_json::to_string(&CustomEvent {
            id: "id".into(),
            subject: "subj".into(),
            event_time: Utc::now(),
            data: CustomEventData::LoggedIn(LoggedInEventData {
                user: Some("user".into()),
            })
        })?
    );
    Ok(())
}
