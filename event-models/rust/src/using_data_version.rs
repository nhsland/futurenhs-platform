use chrono::{DateTime, Utc};
use serde::ser;
use serde::{Deserialize, Serialize};

mod gen {
    use serde::{Deserialize, Serialize};

    schemafy::schemafy!("../schema.json");
}

// TODO: This would have to be generated. Possibly with some kind of macro
pub use gen::{LoggedInEventData, LoggedInEventV2Data, LoginFailedEventData};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoggedInEvent {
    pub id: String,
    pub subject: String,
    #[serde(serialize_with = "logged_in_event_type")]
    pub event_type: (),
    pub event_time: DateTime<Utc>,
    pub data: LoggedInEventData,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoggedInEventV2 {
    pub id: String,
    pub subject: String,
    #[serde(serialize_with = "logged_in_event_type")]
    pub event_type: (),
    pub event_time: DateTime<Utc>,
    pub data: LoggedInEventV2Data,
}

fn logged_in_event_type<S>(_: &(), serializer: S) -> Result<S::Ok, S::Error>
where
    S: ser::Serializer,
{
    serializer.serialize_str("loggedin")
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginFailedEvent {
    pub id: String,
    pub subject: String,
    #[serde(serialize_with = "login_failed_event_type")]
    pub event_type: (),
    pub event_time: DateTime<Utc>,
    pub data: LoginFailedEventData,
}

fn login_failed_event_type<S>(_: &(), serializer: S) -> Result<S::Ok, S::Error>
where
    S: ser::Serializer,
{
    serializer.serialize_str("loginfailed")
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
#[serde(tag = "dataVersion")]
pub enum Event {
    // TODO: This would have to be generated. Possibly with some kind of macro. This is quite a
    // generic enum, so we could add this functionality to schemafy.
    LoggedIn(LoggedInEvent),
    LoggedInV2(LoggedInEventV2),
    LoginFailed(LoginFailedEvent),
}

pub fn test_stringify() -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "{}",
        serde_json::to_string(&Event::LoggedInV2(LoggedInEventV2 {
            id: "id".into(),
            subject: "subj".into(),
            event_type: (),
            event_time: Utc::now(),
            data: LoggedInEventV2Data {
                id: None,
                email: Some("".into())
            }
        }))?
    );
    Ok(())
}

pub fn test_parse() -> Result<Event, Box<dyn std::error::Error>> {
    let event: Event = serde_json::from_str(
        r#"{ "eventTime": "2020-01-01T01:00:00Z", "id": "1", "subject": "anonymous", "eventType": "loggedin", "dataVersion": "loggedinv2", "data": {} }"#,
    )?;
    Ok(event)
}
