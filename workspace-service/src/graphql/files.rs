use super::azure;
use super::db;
use anyhow::Result;
use async_compat::Compat;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use azure_sdk_core::prelude::*;
use azure_sdk_storage_blob::{blob::CopyStatus, Blob};
use azure_sdk_storage_core::prelude::*;
use chrono::{DateTime, Utc};
use sqlx::PgPool;
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
    #[field(desc = "The blob storage path for the file")]
    pub blob_storage_path: String,
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

impl From<db::File> for File {
    fn from(d: db::File) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
            folder: d.folder.into(),
            file_name: d.file_name,
            file_type: d.file_type,
            blob_storage_path: d.blob_storage_path,
            created_at: d.created_at,
            modified_at: d.modified_at,
            deleted_at: d.deleted_at,
        }
    }
}

#[derive(Default)]
pub struct FilesQuery;

#[Object]
impl FilesQuery {
    #[field(desc = "Get all Files in a Folder")]
    async fn files_by_folder(&self, context: &Context<'_>, folder: ID) -> FieldResult<Vec<File>> {
        let pool = context.data()?;
        let folder = Uuid::parse_str(&folder)?;
        let files = db::File::find_by_folder(folder, pool).await?;
        Ok(files.into_iter().map(Into::into).collect())
    }

    #[field(desc = "Get file by ID")]
    async fn file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
        let pool = context.data()?;
        let id = Uuid::parse_str(&id)?;
        let file = db::File::find_by_id(id, pool).await?;
        Ok(file.into())
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

        let file = FileData::new(
            &new_file.title,
            &new_file.description,
            &Uuid::parse_str(&new_file.folder)?,
            &new_file.file_name,
            &new_file.file_type,
            &Url::parse(&new_file.temporary_blob_storage_path)?,
        )
        .create(pool, azure_config)
        .await?;

        Ok(file)
    }
}

struct FileData<'a> {
    title: &'a str,
    description: &'a str,
    folder: &'a Uuid,
    file_name: &'a str,
    file_type: &'a str,
    blob_storage_url: &'a Url,
}

impl<'a> FileData<'a> {
    fn new(
        title: &'a str,
        description: &'a str,
        folder: &'a Uuid,
        file_name: &'a str,
        file_type: &'a str,
        blob_storage_url: &'a Url,
    ) -> Self {
        Self {
            title,
            description,
            folder,
            file_name,
            file_type,
            blob_storage_url,
        }
    }

    /// TODO: needs refactor
    async fn create(&self, pool: &PgPool, azure_config: &azure::Config) -> Result<File> {
        let storage_account_name = "fnhsfilesdevstu"; // TODO
        let client = client::with_access_key(storage_account_name, &azure_config.access_key);
        println!("client.blob_uri() {}", client.blob_uri());
        let container_name = azure_config
            .files_container_url
            .path_segments()
            .expect("invalid files_container_url")
            .next()
            .expect("cannot get container name from url");
        let blob_name = self
            .blob_storage_url
            .path_segments()
            .ok_or_else(|| anyhow::anyhow!("invalid temporary_blob_storage_path"))?
            .nth(1)
            .ok_or_else(|| {
                anyhow::anyhow!("cannot get blob name from temporary_blob_storage_path")
            })?;
        let blob_uuid = Uuid::parse_str(blob_name)?;
        let source_url = azure::create_download_sas(azure_config, &blob_uuid)?;
        let response = Compat::new(
            client
                .copy_blob_from_url()
                .with_container_name(&container_name)
                .with_blob_name(blob_name)
                .with_source_url(source_url.as_str())
                .with_is_synchronous(true)
                .finalize(),
        )
        .await?;
        // TODO: add event.
        if let CopyStatus::Success = response.copy_status {
            let file: File = db::File::create(
                self.title,
                self.description,
                self.folder,
                self.file_name,
                self.file_type,
                blob_name,
                pool,
            )
            .await?
            .into();
            Ok(file)
        } else {
            Err(anyhow::anyhow!(
                "Sync copy did not complete: {}",
                response.copy_status
            ))
        }
    }
}
