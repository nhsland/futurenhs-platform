use super::db;
use async_graphql::{Context, FieldResult, Object, SimpleObject, ID};
use chrono::{DateTime, Utc};
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
    pub folder_id: ID,
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

impl From<db::File> for File {
    fn from(d: db::File) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
            folder_id: d.folder_id.into(),
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
    async fn files_by_folder(
        &self,
        context: &Context<'_>,
        folder_id: ID,
    ) -> FieldResult<Vec<File>> {
        let pool = context.data()?;
        let folder_id = Uuid::parse_str(&folder_id)?;
        let files = db::File::find_by_folder(folder_id, pool).await?;
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
