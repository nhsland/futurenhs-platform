use serde::{Deserialize, Serialize};

schemafy::schemafy!(
    root: Event
    "../schema.json"
);

pub fn parse() -> Result<Event, Box<dyn std::error::Error>> {
    let event: Event = serde_json::from_str(r#"{ "eventTime": "2020", "id": "1", "subject": "anonymous" }"#)?;
    Ok(event)
}
