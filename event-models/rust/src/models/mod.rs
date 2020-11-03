mod generated;

use chrono::{DateTime, Utc};
pub use generated::*;
use serde::de;
use serde::ser::{self, Error as _, SerializeStruct};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, PartialEq, Clone)]
pub struct Event {
    pub id: String,
    pub subject: String,
    pub event_time: DateTime<Utc>,
    pub data: EventData,
}

impl Event {
    pub fn new(subject: impl Into<String>, data: impl Into<EventData>) -> Self {
        Self {
            id: format!("{}", Uuid::new_v4()),
            subject: subject.into(),
            event_time: Utc::now(),
            data: data.into(),
        }
    }
}

impl<'de> Deserialize<'de> for Event {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: de::Deserializer<'de>,
    {
        #[derive(Deserialize)]
        #[serde(rename_all = "camelCase")]
        struct RawEvent {
            id: String,
            subject: String,
            event_time: DateTime<Utc>,
            event_type: String,
            data: serde_json::Value,
            data_version: String,
        }

        const DATA_VARIANTS: &[&str] = &["see valid combinations in schema.json"];

        let RawEvent {
            id,
            subject,
            event_time,
            event_type,
            data,
            data_version,
        } = RawEvent::deserialize(deserializer)?;
        let data =
            EventData::deserialize(&event_type, &data_version, data).map_err(|err| match err {
                EventDataDeserializationError::Json(err) => de::Error::custom(err),
                EventDataDeserializationError::UnknownVariant => de::Error::unknown_variant(
                    &format!("eventType: {}, dataVersion: {}", event_type, data_version),
                    DATA_VARIANTS,
                ),
            })?;

        Ok(Event {
            id,
            subject,
            event_time,
            data,
        })
    }
}

impl Serialize for Event {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: ser::Serializer,
    {
        let mut state = serializer.serialize_struct("Event", 6)?;
        state.serialize_field("id", &self.id)?;
        state.serialize_field("subject", &self.subject)?;
        state.serialize_field("eventTime", &self.event_time)?;
        let (event_type, data_version, data) = self.data.serialize().map_err(S::Error::custom)?;
        state.serialize_field("eventType", event_type)?;
        state.serialize_field("data", &data)?;
        state.serialize_field("dataVersion", data_version)?;
        state.end()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn serialize() {
        let s = serde_json::to_string(&Event {
            id: "id".into(),
            subject: "subj".into(),
            event_time: DateTime::parse_from_rfc3339("2020-09-09T10:22:42.235679Z")
                .unwrap()
                .with_timezone(&Utc),
            data: ContentViewedData {
                user_id: "user".into(),
                content_id: "content".into(),
                content_type: "Folder".into(),
                workspace_id: "workspace".into(),
                error: None,
            }
            .into(),
        })
        .unwrap();
        assert_eq!(
            s,
            r#"{"id":"id","subject":"subj","eventTime":"2020-09-09T10:22:42.235679Z","eventType":"ContentViewed","data":{"contentId":"content","contentType":"Folder","userId":"user","workspaceId":"workspace"},"dataVersion":"1"}"#
        );
    }

    #[test]
    fn deserialize() {
        let event: Event = serde_json::from_str(
            r#"{"id":"id","subject":"subj","eventTime":"2020-09-09T10:22:42.235679Z","eventType":"ContentViewed","data":{"contentId":"content","contentType":"Folder","userId":"user","workspaceId":"workspace"},"dataVersion":"1"}"#
        ).unwrap();
        assert_eq!(
            event,
            Event {
                id: "id".into(),
                subject: "subj".into(),
                event_time: DateTime::parse_from_rfc3339("2020-09-09T10:22:42.235679Z")
                    .unwrap()
                    .with_timezone(&Utc),
                data: ContentViewedData {
                    user_id: "user".into(),
                    content_id: "content".into(),
                    content_type: "Folder".into(),
                    workspace_id: "workspace".into(),
                    error: None,
                }
                .into()
            }
        );
    }
}
