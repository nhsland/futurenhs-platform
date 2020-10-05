use super::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use sqlx::PgPool;
use uuid::Uuid;

pub struct File {
    // todo - Descriptions
    #[field(desc = "The id of the file")]
    pub id: ID,
    pub title: String,
    pub description: String,
    pub folder_id: ID,
    pub file_name: String,
    pub file_type: String,
    pub blob_storage_path: String,
    pub created_at: sqlx::types::time::PrimitiveDateTime,
    pub modified_at: sqlx::types::time::PrimitiveDateTime,
    pub deleted_at: Option<sqlx::types::time::PrimitiveDateTime>,
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
