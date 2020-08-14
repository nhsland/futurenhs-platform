use serde::{Deserialize, Serialize};

#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) enum SimpleTypes {
    Array,
    Boolean,
    Integer,
    Null,
    Number,
    Object,
    String,
}

#[derive(Clone, PartialEq, Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub(crate) struct Schema {
    #[serde(rename = "$ref")]
    pub ref_: Option<String>,
    #[serde(rename = "$schema")]
    pub schema: Option<String>,
    pub all_of: Option<Vec<Schema>>,
    pub default: Option<serde_json::Value>,
    #[serde(default)]
    pub definitions: ::std::collections::BTreeMap<String, Schema>,
    pub description: Option<String>,
    pub items: Option<Box<Schema>>,
    pub one_of: Option<Vec<Schema>>,
    pub format: Option<String>,
    #[serde(rename = "enum")]
    pub enum_: Option<Vec<String>>,
    #[serde(default)]
    pub properties: ::std::collections::BTreeMap<String, Schema>,
    pub required: Option<Vec<String>>,
    pub title: Option<String>,
    #[serde(rename = "type")]
    pub type_: Option<SimpleTypes>,
}
