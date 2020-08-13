use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

mod gen {
    use serde::{Deserialize, Serialize};

    schemafy::schemafy!("../schema.json");
}

// TODO: This would have to be generated. Possibly with some kind of macro
pub use gen::{LoggedInEventData, LoggedInEventV2Data, LoginFailedEventData};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EventType {
    // TODO: This would have to be generated. Possibly with some kind of macro. This is quite a
    // generic enum, so we could add this functionality to schemafy.
    LoggedIn,
    LoginFailed,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
#[serde(tag = "dataVersion", content = "data")]
pub enum EventData {
    // TODO: This would have to be generated. Possibly with some kind of macro. This is quite a
    // generic enum, so we could add this functionality to schemafy.
    LoggedIn(LoggedInEventData),
    LoggedInV2(LoggedInEventV2Data),
    LoginFailed(LoginFailedEventData),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    pub id: String,
    pub subject: String,
    pub event_type: EventType,
    pub event_time: DateTime<Utc>,
    #[serde(flatten)]
    pub data: EventData,
}

pub fn test_stringify() -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "{}",
        serde_json::to_string(&Event {
            id: "id".into(),
            subject: "subj".into(),
            event_type: EventType::LoggedIn,
            event_time: Utc::now(),
            data: EventData::LoggedIn(LoggedInEventData {
                user: Some("user".into()),
            })
        })?
    );
    Ok(())
}

pub fn test_parse() -> Result<Event, Box<dyn std::error::Error>> {
    let event: Event = serde_json::from_str(
        r#"{ "eventTime": "2020-01-01T01:00:00Z", "id": "1", "subject": "anonymous", "eventType": "loggedin", "dataVersion": "loggedinv2", "data": {} }"#,
    )?;
    Ok(event)
}
