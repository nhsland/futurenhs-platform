use chrono::{DateTime, Utc};
use serde::de;
use serde::ser::{self, SerializeStruct};
use serde::{Deserialize, Serialize};
use std::fmt;

mod gen {
    use serde::{Deserialize, Serialize};

    schemafy::schemafy!("../schema.json");
}

#[derive(Debug)]
pub struct Event {
    pub id: String,
    pub subject: String,
    pub event_time: DateTime<Utc>,
    pub data: EventData,
}

macro_rules! event_serialization {
    ($($event_type:literal, $data_version:literal, $enum_variant:ident, $data_type:ident;)*) => {
        pub use gen::{
            $(
                $data_type,
            )*
        };

        #[derive(Debug)]
        pub enum EventData {
            $(
                $enum_variant($data_type),
            )*
        }

        impl<'de> Deserialize<'de> for Event {
            fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
            where
                D: de::Deserializer<'de>,
            {
                #[derive(Deserialize)]
                #[serde(field_identifier, rename_all = "camelCase")]
                enum Field {
                    Id,
                    Subject,
                    EventTime,
                    EventType,
                    Data,
                    DataVersion,
                };

                struct EventVisitor;

                impl<'de> de::Visitor<'de> for EventVisitor {
                    type Value = Event;

                    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                        formatter.write_str("struct Event")
                    }

                    fn visit_map<V>(self, mut map: V) -> Result<Event, V::Error>
                    where
                        V: de::MapAccess<'de>,
                    {
                        let mut id = None;
                        let mut subject = None;
                        let mut event_time = None;
                        let mut event_type = None;
                        let mut data: Option<serde_json::Value> = None;
                        let mut data_version = None;
                        while let Some(key) = map.next_key()? {
                            match key {
                                Field::Id => {
                                    if id.is_some() {
                                        return Err(de::Error::duplicate_field("id"));
                                    }
                                    id = Some(map.next_value()?);
                                }
                                Field::Subject => {
                                    if subject.is_some() {
                                        return Err(de::Error::duplicate_field("subject"));
                                    }
                                    subject = Some(map.next_value()?);
                                }
                                Field::EventTime => {
                                    if event_time.is_some() {
                                        return Err(de::Error::duplicate_field("eventTime"));
                                    }
                                    event_time = Some(map.next_value()?);
                                }
                                Field::EventType => {
                                    if event_type.is_some() {
                                        return Err(de::Error::duplicate_field("eventType"));
                                    }
                                    event_type = Some(map.next_value()?);
                                }
                                Field::Data => {
                                    if data.is_some() {
                                        return Err(de::Error::duplicate_field("data"));
                                    }
                                    data = Some(map.next_value()?);
                                }
                                Field::DataVersion => {
                                    if data_version.is_some() {
                                        return Err(de::Error::duplicate_field("dataVersion"));
                                    }
                                    data_version = Some(map.next_value()?);
                                }
                            }
                        }
                        let id = id.ok_or_else(|| de::Error::missing_field("id"))?;
                        let subject = subject.ok_or_else(|| de::Error::missing_field("subject"))?;
                        let event_time = event_time.ok_or_else(|| de::Error::missing_field("eventTime"))?;
                        let event_type = event_type.ok_or_else(|| de::Error::missing_field("eventType"))?;
                        let data = data.ok_or_else(|| de::Error::missing_field("data"))?;
                        let data_version =
                            data_version.ok_or_else(|| de::Error::missing_field("dataVersion"))?;
                        let data = match (event_type, data_version) {
                            $(
                                ($event_type, $data_version) => EventData::$enum_variant(
                                    serde_json::from_value(data).map_err(de::Error::custom)?,
                                ),
                            )*
                            (a, b) => {
                                return Err(de::Error::unknown_variant(
                                    &format!("eventType: {}, dataVersion: {}", a, b),
                                    DATA_VARIANTS,
                                ))
                            }
                        };
                        Ok(Event {
                            id,
                            subject,
                            event_time,
                            data,
                        })
                    }
                }

                const FIELDS: &[&str] = &[
                    "id",
                    "subject",
                    "eventTime",
                    "eventType",
                    "data",
                    "dataVersion",
                ];
                const DATA_VARIANTS: &[&str] = &["see valid combinations in schema.json"];
                deserializer.deserialize_struct("Event", FIELDS, EventVisitor)
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
                match &self.data {
                    $(
                        EventData::$enum_variant(data) => {
                            state.serialize_field("eventType", $event_type)?;
                            state.serialize_field("data", &data)?;
                            state.serialize_field("dataVersion", $data_version)?;
                        }
                    )*
                }
                state.end()
            }
        }
    }
}

event_serialization!(
    "loggedin", "1", LoggedIn, LoggedInEventData;
    "loggedin", "2", LoggedInV2, LoggedInEventV2Data;
    "loginfailed", "1", LoginFailed, LoginFailedEventData;
);

pub fn test_stringify() -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "{}",
        serde_json::to_string(&Event {
            id: "id".into(),
            subject: "subj".into(),
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
        r#"{ "eventTime": "2020-01-01T01:00:00Z", "id": "1", "subject": "anonymous", "eventType": "loggedin", "dataVersion": "2", "data": {} }"#,
    )?;
    Ok(event)
}
