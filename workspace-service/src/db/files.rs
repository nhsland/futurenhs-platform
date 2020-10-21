// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use anyhow::Result;
use chrono::{DateTime, Utc};
use sqlx::{types::Uuid, PgPool};

#[derive(Clone)]
pub struct File {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub folder: Uuid,
    pub file_name: String,
    pub file_type: String,
    pub blob_storage_path: String,
    pub created_at: DateTime<Utc>,
    pub modified_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

impl File {
    pub async fn create(
        title: &str,
        description: &str,
        folder: &Uuid,
        file_name: &str,
        file_type: &str,
        blob_storage_path: &str,
        pool: &PgPool,
    ) -> Result<File> {
        let file = sqlx::query_file_as!(
            File,
            "sql/files/create.sql",
            title,
            description,
            folder,
            file_name,
            file_type,
            blob_storage_path,
        )
        .fetch_one(pool)
        .await?;

        Ok(file)
    }

    pub async fn find_by_folder(folder: Uuid, pool: &PgPool) -> Result<Vec<File>> {
        let files = sqlx::query_file_as!(File, "sql/files/find_by_folder.sql", folder)
            .fetch_all(pool)
            .await?;

        Ok(files)
    }

    pub async fn find_by_id(id: Uuid, pool: &PgPool) -> Result<File> {
        let file = sqlx::query_file_as!(File, "sql/files/find_by_id.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(file)
    }

    pub async fn delete(id: Uuid, pool: &PgPool) -> Result<File> {
        let file = sqlx::query_file_as!(File, "sql/files/delete.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(file)
    }
}
