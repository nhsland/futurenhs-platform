use super::azure;
use super::db;
use crate::azure::Config;
use anyhow::Result;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use chrono::{DateTime, Utc};
use url::Url;
use uuid::Uuid;

#[SimpleObject(desc = "A file")]
pub struct File {
    #[field(desc = "The id of the file")]
    pub id: ID,
    #[field(desc = "The title of the file")]
    pub title: String,
    #[field(desc = "The description of the file")]
    pub description: String,
    #[field(desc = "The id of the parent folder")]
    pub folder: ID,
    #[field(desc = "The name of the file")]
    pub file_name: String,
    #[field(desc = "The type of the file")]
    pub file_type: String,
    // #[field(desc = "The blob storage path for the file")]
    // pub blob_storage_path: String,
    #[field(desc = "The temporary url to download file from blob storage")]
    pub temporary_blob_storage_path: String,
    #[field(desc = "The time the file was created")]
    pub created_at: DateTime<Utc>,
    #[field(desc = "The time the file was modified")]
    pub modified_at: DateTime<Utc>,
    #[field(desc = "The time the file was deleted")]
    pub deleted_at: Option<DateTime<Utc>>,
}

#[InputObject]
pub struct NewFile {
    pub title: String,
    pub description: String,
    pub folder: ID,
    pub file_name: String,
    pub file_type: String,
    pub temporary_blob_storage_path: String,
}

impl File {
    fn from_db(d: db::File, c: &Config) -> Result<Self> {
        Ok(Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
            folder: d.folder.into(),
            file_name: d.file_name,
            file_type: d.file_type,
            // blob_storage_path: d.blob_storage_path,
            temporary_blob_storage_path: azure::create_download_sas(
                c,
                &d.blob_storage_path.parse()?,
            )?
            .into_string(),
            created_at: d.created_at,
            modified_at: d.modified_at,
            deleted_at: d.deleted_at,
        })
    }
}

#[derive(Default)]
pub struct FilesQuery;

#[Object]
impl FilesQuery {
    #[field(desc = "Get all Files in a Folder")]
    async fn files_by_folder(&self, context: &Context<'_>, folder: ID) -> FieldResult<Vec<File>> {
        let pool = context.data()?;
        let azure_config = context.data()?;
        let folder = Uuid::parse_str(&folder)?;
        let files = db::File::find_by_folder(folder, pool).await?;

        Ok(files
            .into_iter()
            .map(|file| File::from_db(file, azure_config))
            .collect::<Result<Vec<_>>>()?)
    }

    #[field(desc = "Get file by ID")]
    async fn file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
        let pool = context.data()?;
        let azure_config = context.data()?;
        let id = Uuid::parse_str(&id)?;
        let file = db::File::find_by_id(id, pool).await?;
        Ok(File::from_db(file, azure_config)?)
    }
}

#[derive(Default)]
pub struct FilesMutation;

#[Object]
impl FilesMutation {
    #[field(desc = "Create a new file (returns the created file)")]
    async fn create_file(&self, context: &Context<'_>, new_file: NewFile) -> FieldResult<File> {
        let pool = context.data()?;
        let azure_config = context.data()?;
        let folder = Uuid::parse_str(&new_file.folder)?;
        let destination = azure::copy_blob_from_url(
            &Url::parse(&new_file.temporary_blob_storage_path)?,
            azure_config,
        )
        .await?;

        // TODO: add event.

        let file = db::File::create(
            &new_file.title,
            &new_file.description,
            &folder,
            &new_file.file_name,
            &new_file.file_type,
            &destination,
            pool,
        )
        .await?;

        Ok(File::from_db(file, azure_config)?)
    }
}
