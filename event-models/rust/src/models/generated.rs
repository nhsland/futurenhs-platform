// This file was automatically generated by yarn generate.
// DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
// and run yarn generate to regenerate this file.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ContentViewedData {
    ///
    #[serde(rename = "userId")]
    pub user_id: String,

    ///
    #[serde(rename = "contentId")]
    pub content_id: String,

    ///
    #[serde(rename = "contentType")]
    pub content_type: String,

    ///
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    ///
    #[serde(rename = "error", skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FileCreatedData {
    ///
    #[serde(rename = "fileId")]
    pub file_id: String,

    /// The date at which the file has been created
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,

    /// The folder that the file is in
    #[serde(rename = "folderId")]
    pub folder_id: String,

    /// The workspace that the file is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    ///
    #[serde(rename = "fileTitle")]
    pub file_title: String,

    ///
    #[serde(rename = "fileDescription")]
    pub file_description: String,

    /// The MIME type of the file, e.g. text/csv for a CSV file
    #[serde(rename = "fileType")]
    pub file_type: String,

    ///
    #[serde(rename = "versionId")]
    pub version_id: String,

    ///
    #[serde(rename = "versionNumber")]
    pub version_number: i64,

    /// The user that created the file
    #[serde(rename = "userId")]
    pub user_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FileUpdatedData {
    ///
    #[serde(rename = "fileId")]
    pub file_id: String,

    /// The date at which the file has been updated (= the new file version has been created)
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,

    /// The folder that the file is in
    #[serde(rename = "folderId")]
    pub folder_id: String,

    /// The workspace that the file is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    ///
    #[serde(rename = "fileTitle")]
    pub file_title: String,

    ///
    #[serde(rename = "fileDescription")]
    pub file_description: String,

    /// The MIME type of the file, e.g. text/csv for a CSV file
    #[serde(rename = "fileType")]
    pub file_type: String,

    ///
    #[serde(rename = "versionId")]
    pub version_id: String,

    ///
    #[serde(rename = "versionNumber")]
    pub version_number: i64,

    /// The user that created the file
    #[serde(rename = "userId")]
    pub user_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FileDeletedData {
    ///
    #[serde(rename = "fileId")]
    pub file_id: String,

    /// The user that deleted the file
    #[serde(rename = "userId")]
    pub user_id: String,

    ///
    #[serde(rename = "versionId")]
    pub version_id: String,

    ///
    #[serde(rename = "versionNumber")]
    pub version_number: i64,

    /// The workspace that the file is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FileDownloadedData {
    ///
    #[serde(rename = "fileId")]
    pub file_id: String,

    /// The user that downloaded the file
    #[serde(rename = "userId")]
    pub user_id: String,

    ///
    #[serde(rename = "versionId")]
    pub version_id: String,

    ///
    #[serde(rename = "versionNumber")]
    pub version_number: i64,

    /// The workspace that the file is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FolderCreatedData {
    ///
    #[serde(rename = "folderId")]
    pub folder_id: String,

    /// The workspace that the folder is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    ///
    #[serde(rename = "title")]
    pub title: String,

    ///
    #[serde(rename = "description")]
    pub description: String,

    /// The user that created the folder
    #[serde(rename = "userId")]
    pub user_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FolderUpdatedData {
    ///
    #[serde(rename = "folderId")]
    pub folder_id: String,

    /// The workspace that the folder is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    ///
    #[serde(rename = "title")]
    pub title: String,

    ///
    #[serde(rename = "description")]
    pub description: String,

    /// The user that updated the folder
    #[serde(rename = "userId")]
    pub user_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FolderDeletedData {
    ///
    #[serde(rename = "folderId")]
    pub folder_id: String,

    /// The workspace that the folder is in
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    /// The user that deleted the folder
    #[serde(rename = "userId")]
    pub user_id: String,
}

///
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct WorkspaceCreatedData {
    ///
    #[serde(rename = "workspaceId")]
    pub workspace_id: String,

    ///
    #[serde(rename = "title")]
    pub title: String,

    /// The id of the user that created the workspace
    #[serde(rename = "userId")]
    pub user_id: String,
}

#[derive(Debug, PartialEq, Clone)]
pub enum EventData {
    ContentViewed(ContentViewedData),
    FileCreated(FileCreatedData),
    FileUpdated(FileUpdatedData),
    FileDeleted(FileDeletedData),
    FileDownloaded(FileDownloadedData),
    FolderCreated(FolderCreatedData),
    FolderUpdated(FolderUpdatedData),
    FolderDeleted(FolderDeletedData),
    WorkspaceCreated(WorkspaceCreatedData),
}

impl From<ContentViewedData> for EventData {
    fn from(data: ContentViewedData) -> Self {
        Self::ContentViewed(data)
    }
}

impl From<FileCreatedData> for EventData {
    fn from(data: FileCreatedData) -> Self {
        Self::FileCreated(data)
    }
}

impl From<FileUpdatedData> for EventData {
    fn from(data: FileUpdatedData) -> Self {
        Self::FileUpdated(data)
    }
}

impl From<FileDeletedData> for EventData {
    fn from(data: FileDeletedData) -> Self {
        Self::FileDeleted(data)
    }
}

impl From<FileDownloadedData> for EventData {
    fn from(data: FileDownloadedData) -> Self {
        Self::FileDownloaded(data)
    }
}

impl From<FolderCreatedData> for EventData {
    fn from(data: FolderCreatedData) -> Self {
        Self::FolderCreated(data)
    }
}

impl From<FolderUpdatedData> for EventData {
    fn from(data: FolderUpdatedData) -> Self {
        Self::FolderUpdated(data)
    }
}

impl From<FolderDeletedData> for EventData {
    fn from(data: FolderDeletedData) -> Self {
        Self::FolderDeleted(data)
    }
}

impl From<WorkspaceCreatedData> for EventData {
    fn from(data: WorkspaceCreatedData) -> Self {
        Self::WorkspaceCreated(data)
    }
}

pub(crate) enum EventDataDeserializationError {
    Json(serde_json::Error),
    UnknownVariant,
}

impl EventData {
    pub(crate) fn deserialize(
        event_type: &str,
        data_version: &str,
        data: serde_json::Value,
    ) -> Result<Self, EventDataDeserializationError> {
        match (event_type, data_version) {
            ("ContentViewed", "1") => Ok(Self::ContentViewed(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FileCreated", "1") => Ok(Self::FileCreated(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FileUpdated", "1") => Ok(Self::FileUpdated(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FileDeleted", "1") => Ok(Self::FileDeleted(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FileDownloaded", "1") => Ok(Self::FileDownloaded(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FolderCreated", "1") => Ok(Self::FolderCreated(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FolderUpdated", "1") => Ok(Self::FolderUpdated(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("FolderDeleted", "1") => Ok(Self::FolderDeleted(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            ("WorkspaceCreated", "1") => Ok(Self::WorkspaceCreated(
                serde_json::from_value(data).map_err(EventDataDeserializationError::Json)?,
            )),

            (_, _) => Err(EventDataDeserializationError::UnknownVariant),
        }
    }

    pub(crate) fn serialize(
        &self,
    ) -> Result<(&'static str, &'static str, serde_json::Value), serde_json::Error> {
        Ok(match self {
            Self::ContentViewed(data) => ("ContentViewed", "1", serde_json::to_value(data)?),

            Self::FileCreated(data) => ("FileCreated", "1", serde_json::to_value(data)?),

            Self::FileUpdated(data) => ("FileUpdated", "1", serde_json::to_value(data)?),

            Self::FileDeleted(data) => ("FileDeleted", "1", serde_json::to_value(data)?),

            Self::FileDownloaded(data) => ("FileDownloaded", "1", serde_json::to_value(data)?),

            Self::FolderCreated(data) => ("FolderCreated", "1", serde_json::to_value(data)?),

            Self::FolderUpdated(data) => ("FolderUpdated", "1", serde_json::to_value(data)?),

            Self::FolderDeleted(data) => ("FolderDeleted", "1", serde_json::to_value(data)?),

            Self::WorkspaceCreated(data) => ("WorkspaceCreated", "1", serde_json::to_value(data)?),
        })
    }
}
