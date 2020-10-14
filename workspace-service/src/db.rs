// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use anyhow::Result;
use chrono::{DateTime, Utc};
use sqlx::{types::Uuid, PgPool};

#[derive(Clone)]
pub struct Workspace {
    pub id: Uuid,
    pub title: String,
    pub description: String,
}

#[cfg(not(test))]
impl Workspace {
    pub async fn create(title: &str, description: &str, pool: &PgPool) -> Result<Workspace> {
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
        title: &str,
        description: &str,
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

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
impl Workspace {
    pub async fn create(title: &str, description: &str, _pool: &PgPool) -> Result<Workspace> {
        let workspace = Workspace {
            id: Uuid::new_v4(),
            title: title.to_string(),
            description: description.to_string(),
        };
        Ok(workspace)
    }

    pub async fn find_all(_pool: &PgPool) -> Result<Vec<Workspace>> {
        Ok(vec![])
    }

    pub async fn find_by_id(id: Uuid, _pool: &PgPool) -> Result<Workspace> {
        let workspace = Workspace {
            id,
            title: "fake workspace".into(),
            description: "fake workspace for tests".into(),
        };
        Ok(workspace)
    }

    pub async fn update(
        id: Uuid,
        title: &str,
        description: &str,
        _pool: &PgPool,
    ) -> Result<Workspace> {
        let workspace = Workspace {
            id,
            title: title.to_string(),
            description: description.to_string(),
        };
        Ok(workspace)
    }

    pub async fn delete(id: Uuid, _pool: &PgPool) -> Result<Workspace> {
        let workspace = Workspace {
            id,
            title: "fake deleted workspace".into(),
            description: "fake deleted workspace for tests".into(),
        };
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

#[cfg(not(test))]
impl Folder {
    pub async fn create(
        title: &str,
        description: &str,
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

    pub async fn update(id: Uuid, title: &str, description: &str, pool: &PgPool) -> Result<Folder> {
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

#[cfg(test)]
impl Folder {
    pub async fn create(
        title: &str,
        description: &str,
        workspace: Uuid,
        _pool: &PgPool,
    ) -> Result<Folder> {
        let folder = Folder {
            id: Uuid::new_v4(),
            title: title.to_string(),
            workspace,
            description: description.to_string(),
        };
        Ok(folder)
    }

    pub async fn find_by_workspace(_workspace: Uuid, _pool: &PgPool) -> Result<Vec<Folder>> {
        Ok(Vec::new())
    }

    pub async fn find_by_id(id: Uuid, _pool: &PgPool) -> Result<Folder> {
        let folder = Folder {
            id,
            title: "fake folder".into(),
            workspace: Uuid::new_v4(),
            description: "fake folder for testing".into(),
        };
        Ok(folder)
    }

    pub async fn update(
        id: Uuid,
        title: &str,
        description: &str,
        _pool: &PgPool,
    ) -> Result<Folder> {
        let folder = Folder {
            id,
            title: title.to_string(),
            workspace: Uuid::new_v4(),
            description: description.to_string(),
        };
        Ok(folder)
    }

    pub async fn delete(id: Uuid, _pool: &PgPool) -> Result<Folder> {
        let folder = Folder {
            id,
            title: "fake folder".into(),
            workspace: Uuid::new_v4(),
            description: "fake folder for testing".into(),
        };
        Ok(folder)
    }
}

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
}

#[derive(Clone)]
pub struct User {
    pub id: Uuid,
    pub auth_id: Uuid,
    pub name: String,
    pub is_platform_admin: bool,
}

#[cfg(not(test))]
impl User {
    pub async fn find_by_auth_id(auth_id: &Uuid, pool: &PgPool) -> Result<Option<User>> {
        let user = sqlx::query_file_as!(User, "sql/users/find_by_auth_id.sql", auth_id)
            .fetch_optional(pool)
            .await?;

        Ok(user)
    }
    pub async fn get_or_create(auth_id: &Uuid, name: &str, pool: &PgPool) -> Result<User> {
        let user = sqlx::query_file_as!(User, "sql/users/get_or_create.sql", auth_id, name)
            .fetch_one(pool)
            .await?;

        Ok(user)
    }

    pub async fn update(auth_id: &Uuid, is_platform_admin: bool, pool: &PgPool) -> Result<User> {
        let user = sqlx::query_file_as!(User, "sql/users/update.sql", auth_id, is_platform_admin)
            .fetch_one(pool)
            .await?;

        Ok(user)
    }
}

#[cfg(test)]
impl User {
    pub async fn find_by_auth_id(auth_id: &Uuid, _pool: &PgPool) -> Result<Option<User>> {
        Ok(Some(User {
            id: Uuid::new_v4(),
            auth_id: auth_id.clone(),
            name: "Test".to_string(),
            is_platform_admin: true,
        }))
    }

    pub async fn get_or_create(auth_id: &Uuid, name: &str, _pool: &PgPool) -> Result<User> {
        Ok(User {
            id: Uuid::new_v4(),
            auth_id: auth_id.clone(),
            name: name.to_string(),
            is_platform_admin: true,
        })
    }

    pub async fn update(auth_id: &Uuid, is_platform_admin: bool, _pool: &PgPool) -> Result<User> {
        Ok(User {
            id: Uuid::new_v4(),
            auth_id: auth_id.clone(),
            name: "Test".to_string(),
            is_platform_admin,
        })
    }
}
