use super::azure;
use super::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use chrono::{DateTime, Utc};
use url::Url;
use uuid::Uuid;

/// A file version
#[derive(SimpleObject)]
pub struct FileVersion {
    /// The id of the file version"
    pub id: ID,
    /// The id of the parent folder"
    pub folder: ID,
    /// The id of the file"
    pub file: Uuid,
    /// The title of the file"
    pub file_title: String,
    /// The description of the file"
    pub file_description: String,
    /// The name of the file"
    pub file_name: String,
    /// The type of the file"
    pub file_type: String,
    /// The path of the file"
    pub blob_storage_path: String,
    /// The time the file version was created"
    pub created_at: DateTime<Utc>,
    /// The user that created the file version"
    pub created_by: Uuid,
    /// The version of the file"
    pub version_number: i16,
    /// The version label"
    pub version_label: String,
}

#[derive(InputObject)]
pub struct NewFileVersion {
    pub folder: ID,
    pub file: ID,
    pub file_title: String,
    pub file_description: String,
    pub file_name: String,
    pub file_type: String,
    pub blob_storage_path: String,
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

#[derive(Default)]
pub struct FileVersionsMutation;

#[Object]
impl FileVersionsMutation {
    /// Create a new file version (returns the created file version)"
    async fn create_file_version(
        &self,
        context: &Context<'_>,
        new_file_version: NewFileVersion,
    ) -> FieldResult<FileVersion> {
        let pool = context.data()?;
        let azure_config = context.data()?;
        let requesting_user = context.data::<super::RequestingUser>()?;
        let user = db::User::find_by_auth_id(&requesting_user.auth_id, pool).await?;
        let file = Uuid::parse_str(&new_file_version.file)?;
        let folder = Uuid::parse_str(&new_file_version.folder)?;
        let destination = azure::copy_blob_from_url(
            &Url::parse(&new_file_version.blob_storage_path)?,
            azure_config,
        )
        .await?;

        // TODO: add event.

        let file_version = db::FileVersion::create(
            Uuid::new_v4(),
            folder,
            file,
            &new_file_version.file_title,
            &new_file_version.file_description,
            &new_file_version.file_name,
            &new_file_version.file_type,
            &destination,
            user.id,
            new_file_version.version_number,
            &new_file_version.version_label,
            pool,
        )
        .await?;

        Ok(file_version.into())
    }
}
