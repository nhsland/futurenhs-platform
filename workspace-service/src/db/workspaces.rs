// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

#[cfg(not(test))]
use crate::db::Group;
use anyhow::Result;
use sqlx::{types::Uuid, PgPool};

#[derive(Clone)]
pub struct Workspace {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub admins: Uuid,
    pub members: Uuid,
}

#[cfg(not(test))]
impl Workspace {
    pub async fn create(title: &str, description: &str, pool: &PgPool) -> Result<Workspace> {
        let mut tx = pool.begin().await?;

        let admins = Group::create(&format!("{} Admins", title), &mut tx).await?;
        let members = Group::create(&format!("{} Members", title), &mut tx).await?;

        let workspace = sqlx::query_file_as!(
            Workspace,
            "sql/workspaces/create.sql",
            title,
            description,
            admins.id,
            members.id
        )
        .fetch_one(&mut tx)
        .await?;
        tx.commit().await?;

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
            admins: Uuid::new_v4(),
            members: Uuid::new_v4(),
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
            admins: Uuid::new_v4(),
            members: Uuid::new_v4(),
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
            admins: Uuid::new_v4(),
            members: Uuid::new_v4(),
        };
        Ok(workspace)
    }

    pub async fn delete(id: Uuid, _pool: &PgPool) -> Result<Workspace> {
        let workspace = Workspace {
            id,
            title: "fake deleted workspace".into(),
            description: "fake deleted workspace for tests".into(),
            admins: Uuid::new_v4(),
            members: Uuid::new_v4(),
        };
        Ok(workspace)
    }
}
