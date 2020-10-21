use super::azure;
use super::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use chrono::{DateTime, Utc};
use url::Url;
use uuid::Uuid;

#[SimpleObject(desc = "A file version")]
pub struct FileVersion {
    #[field(desc = "The id of the file")]
    pub id: ID,
    #[field(desc = "The id of the parent folder")]
    pub folder: ID,
    #[field(desc = "The id of the file")]
    pub file: Uuid,
    #[field(desc = "The title of the file")]
    pub file_title: String,
    #[field(desc = "The description of the file")]
    pub file_description: String,
    #[field(desc = "The name of the file")]
    pub file_name: String,
    #[field(desc = "The type of the file")]
    pub file_type: String,
    #[field(desc = "The path of the file")]
    pub blob_storage_path: String,
    #[field(desc = "The time the file was created")]
    pub created_at: DateTime<Utc>,
    #[field(desc = "The user that created the file")]
    pub created_by: Uuid,
    #[field(desc = "The version of the file")]
    pub version_number: i16,
    #[field(desc = "The version label")]
    pub version_label: String,
}

#[InputObject]
pub struct NewFileVersion {
    pub folder: ID,
    pub file: Uuid,
    pub file_title: String,
    pub file_description: String,
    pub file_name: String,
    pub file_type: String,
    pub blob_storage_path: String,
    pub created_by: Uuid,
    pub modified_at: DateTime<Utc>,
    pub version_number: i16,
    pub version_label: String,
}

impl From<db::FileVersion> for FileVersion {
    fn from(d: db::FileVersion) -> Self {
        Self {
            id: d.id.into(),
            folder: d.folder.into(),
            file: d.file,
            file_title: d.file_title,
            file_description: d.file_description,
            file_name: d.file_name,
            file_type: d.file_type,
            blob_storage_path: d.blob_storage_path,
            created_at: d.created_at,
            created_by: d.created_by,
            version_number: d.version_number,
            version_label: d.version_label,
        }
    }
}
//
// #[derive(Default)]
// pub struct FileVersionsQuery;
//
// #[Object]
// impl FileVersionsQuery {
//     #[field(desc = "Get file by ID")]
//     async fn file(&self, context: &Context<'_>, id: ID) -> FieldResult<FileVersion> {
//         let pool = context.data()?;
//         let id = Uuid::parse_str(&id)?;
//         let file = db::FileVersion::find_by_id(id, pool).await?;
//         Ok(file.into())
//     }
// }
//
#[derive(Default)]
pub struct FileVersionsMutation;

#[Object]
impl FileVersionsMutation {
    #[field(desc = "Create a new file version (returns the created file version)")]
    async fn create_file_version(
        &self,
        context: &Context<'_>,
        new_file_version: NewFileVersion,
    ) -> FieldResult<FileVersion> {
        let pool = context.data()?;
        let azure_config = context.data()?;
        let folder = Uuid::parse_str(&new_file_version.folder)?;
        let destination = azure::copy_blob_from_url(
            &Url::parse(&new_file_version.blob_storage_path)?,
            azure_config,
        )
        .await?;

        // TODO: add event.

        let file_version = db::FileVersion::create(
            &folder,
            &new_file_version.file,
            &new_file_version.file_title,
            &new_file_version.file_description,
            &new_file_version.file_name,
            &new_file_version.file_type,
            &destination,
            &new_file_version.created_by,
            &new_file_version.version_number,
            &new_file_version.version_label,
            pool,
        )
        .await?;

        Ok(file_version.into())
    }
}
