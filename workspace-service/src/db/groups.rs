// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use anyhow::Result;
use sqlx::types::Uuid;
use sqlx::{Executor, Postgres};

#[derive(Clone)]
pub struct Group {
    pub id: Uuid,
    pub title: String,
}

#[cfg(not(test))]
impl Group {
    pub async fn create<'c, E>(title: &str, executor: E) -> Result<Group>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let group = sqlx::query_file_as!(Group, "sql/groups/create.sql", title)
            .fetch_one(executor)
            .await?;

        Ok(group)
    }
}

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
impl Group {
    #[allow(dead_code)]
    pub async fn create<'c, E>(title: &str, _executor: E) -> Result<Group>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let group = Group {
            id: Uuid::new_v4(),
            title: title.to_string(),
        };
        Ok(group)
    }
}
