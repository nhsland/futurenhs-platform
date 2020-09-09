use anyhow::Result;
use sqlx::{types::Uuid, PgPool};

#[derive(Clone)]
pub struct Workspace {
    pub id: Uuid,
    pub title: String,
    pub description: String,
}

impl Workspace {
    pub async fn create(title: String, description: String, pool: &PgPool) -> Result<Workspace> {
        let workspace =
            sqlx::query_file_as!(Workspace, "sql/workspaces/create.sql", title, description)
                .fetch_one(pool)
                .await?;

        Ok(workspace)
    }

    pub async fn find_all(pool: &PgPool) -> Result<Vec<Workspace>> {
        let workspaces = sqlx::query_file_as!(Workspace, "sql/workspaces/find_all.sql")
            .fetch_all(pool)
            .await?;

        Ok(workspaces)
    }

    pub async fn find_by_id(id: Uuid, pool: &PgPool) -> Result<Workspace> {
        let workspace = sqlx::query_file_as!(Workspace, "sql/workspaces/find_by_id.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(workspace)
    }

    pub async fn update(
        id: Uuid,
        title: String,
        description: String,
        pool: &PgPool,
    ) -> Result<Workspace> {
        let workspace = sqlx::query_file_as!(
            Workspace,
            "sql/workspaces/update.sql",
            id,
            title,
            description
        )
        .fetch_one(pool)
        .await?;

        Ok(workspace)
    }

    pub async fn delete(id: Uuid, pool: &PgPool) -> Result<Workspace> {
        let workspace = sqlx::query_file_as!(Workspace, "sql/workspaces/delete.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(workspace)
    }
}

#[derive(Clone)]
pub struct Folder {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub workspace: Uuid,
}

impl Folder {
    pub async fn create(
        title: String,
        description: String,
        workspace: Uuid,
        pool: &PgPool,
    ) -> Result<Folder> {
        let folder = sqlx::query_file_as!(
            Folder,
            "sql/folders/create.sql",
            title,
            description,
            workspace
        )
        .fetch_one(pool)
        .await?;

        Ok(folder)
    }

    pub async fn find_by_workspace(workspace: Uuid, pool: &PgPool) -> Result<Vec<Folder>> {
        let folders = sqlx::query_file_as!(Folder, "sql/folders/find_by_workspace.sql", workspace)
            .fetch_all(pool)
            .await?;

        Ok(folders)
    }

    pub async fn find_by_id(id: Uuid, pool: &PgPool) -> Result<Folder> {
        let folder = sqlx::query_file_as!(Folder, "sql/folders/find_by_id.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(folder)
    }

    pub async fn update(
        id: Uuid,
        title: String,
        description: String,
        pool: &PgPool,
    ) -> Result<Folder> {
        let folder = sqlx::query_file_as!(Folder, "sql/folders/update.sql", id, title, description)
            .fetch_one(pool)
            .await?;

        Ok(folder)
    }

    pub async fn delete(id: Uuid, pool: &PgPool) -> Result<Folder> {
        let folder = sqlx::query_file_as!(Folder, "sql/folders/delete.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(folder)
    }
}
