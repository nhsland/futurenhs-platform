use super::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use chrono::{DateTime, Utc};
use sqlx::PgPool;
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
        let folder = Uuid::parse_str(&new_file.folder)?;

        create_file(
            &new_file.title,
            &new_file.description,
            &folder,
            &new_file.file_name,
            &new_file.file_type,
            &new_file.temporary_blob_storage_path,
            pool,
        )
        .await
    }
}

async fn create_file(
    title: &str,
    description: &str,
    folder: &Uuid,
    file_name: &str,
    file_type: &str,
    temporary_blob_storage_path: &str,
    pool: &PgPool,
) -> FieldResult<File> {
    // TODO: AB#1794 - move temporary_blob_storage_path into final location and
    // pass new location into db::File::create
    // TODO: add event.
    let file: File = db::File::create(
        title,
        description,
        folder,
        file_name,
        file_type,
        temporary_blob_storage_path,
        pool,
    )
    .await?
    .into();
    Ok(file)
}
