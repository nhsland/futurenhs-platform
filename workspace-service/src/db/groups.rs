// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use anyhow::Result;
use sqlx::{types::Uuid, PgPool};

#[derive(Clone)]
pub struct Group {
    pub id: Uuid,
    pub title: String,
}

#[cfg(not(test))]
impl Group {
    pub async fn create(title: &str, pool: &PgPool) -> Result<Group> {
        let group =
            sqlx::query_file_as!(Group, "sql/groups/create.sql", title)
                .fetch_one(pool)
                .await?;

        Ok(group)
    }

    pub async fn find_by_id(id: Uuid, pool: &PgPool) -> Result<Group> {
        let group = sqlx::query_file_as!(Group, "sql/groups/find_by_id.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(group)
    }

    pub async fn update(
        id: Uuid,
        title: &str,
        pool: &PgPool,
    ) -> Result<Group> {
        let group = sqlx::query_file_as!(
            Group,
            "sql/groups/update.sql",
            id,
            title,
        )
        .fetch_one(pool)
        .await?;

        Ok(group)
    }

    pub async fn delete(id: Uuid, pool: &PgPool) -> Result<Group> {
        let group = sqlx::query_file_as!(Group, "sql/groups/delete.sql", id)
            .fetch_one(pool)
            .await?;

        Ok(group)
    }
}

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
impl Group {
    pub async fn create(title: &str, _pool: &PgPool) -> Result<Group> {
        let group = Group {
            id: Uuid::new_v4(),
            title: title.to_string(),
        };
        Ok(group)
    }

    pub async fn find_by_id(id: Uuid, _pool: &PgPool) -> Result<Group> {
        let group = Group {
            id,
            title: "fake group".into(),
        };
        Ok(group)
    }

    pub async fn update(
        id: Uuid,
        title: &str,
        _pool: &PgPool,
    ) -> Result<Group> {
        let group = Group {
            id,
            title: title.to_string(),
        };
        Ok(group)
    }

    pub async fn delete(id: Uuid, _pool: &PgPool) -> Result<Group> {
        let group = Group {
            id,
            title: "fake deleted group".into(),
        };
        Ok(group)
    }
}
