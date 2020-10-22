// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use anyhow::Result;
use chrono::{DateTime, Utc};
use sqlx::{types::Uuid, Executor, PgPool, Postgres};

#[derive(Clone)]
pub struct File {
    pub id: Uuid,
    pub created_at: DateTime<Utc>,
    pub created_by: Uuid,
    pub deleted_at: Option<DateTime<Utc>>,
    pub deleted_by: Option<Uuid>,
    pub latest_version: Uuid,
}

#[derive(Clone)]
pub struct FileWithVersion {
    pub id: Uuid,
    pub title: String,
    pub blob_storage_path: String,
    pub description: String,
    pub folder: Uuid,
    pub file_name: String,
    pub file_type: String,
    pub created_at: DateTime<Utc>,
    pub modified_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub version: Uuid,
    pub version_number: i16,
}

impl File {
    pub async fn create<'c, E>(created_by: Uuid, latest_version: Uuid, executor: E) -> Result<File>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let file = sqlx::query_file_as!(File, "sql/files/create.sql", created_by, latest_version)
            .fetch_one(executor)
            .await?;

        Ok(file)
    }

    pub async fn find_by_folder(folder: Uuid, pool: &PgPool) -> Result<Vec<FileWithVersion>> {
        let files = sqlx::query_file_as!(FileWithVersion, "sql/files/find_by_folder.sql", folder)
            .fetch_all(pool)
            .await?;

        Ok(files)
    }

    pub async fn find_by_id(id: Uuid, pool: &PgPool) -> Result<FileWithVersion> {
        let file = sqlx::query_file_as!(FileWithVersion, "sql/files/find_by_id.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(file)
    }

    pub async fn update_latest_version<'c, E>(
        id: Uuid,
        current_latest_version: Uuid,
        new_latest_version: Uuid,
        executor: E,
    ) -> Result<File>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let file = sqlx::query_file_as!(
            File,
            "sql/files/update_latest_version.sql",
            id,
            current_latest_version,
            new_latest_version
        )
        .fetch_one(executor)
        .await?;

        Ok(file)
    }

    pub async fn delete(id: Uuid, deleted_by: Uuid, pool: &PgPool) -> Result<FileWithVersion> {
        let file = sqlx::query_file_as!(FileWithVersion, "sql/files/delete.sql", id, deleted_by)
            .fetch_one(pool)
            .await?;

        Ok(file)
    }
}
