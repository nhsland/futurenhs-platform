use anyhow::Result;
use sqlx::{types::Uuid, PgPool};

#[derive(Clone)]
pub struct Workspace {
    pub id: Uuid,
    pub title: String,
}

impl Workspace {
    pub async fn find_all(pool: &PgPool) -> Result<Vec<Workspace>> {
        let workspaces = sqlx::query_file_as!(Workspace, "sql/find_all.sql")
            .fetch_all(pool)
            .await?;

        Ok(workspaces)
    }
}
