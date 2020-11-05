// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use crate::db::User;
use anyhow::Result;
use sqlx::types::Uuid;
use sqlx::{Executor, Postgres};

#[derive(Clone)]
pub struct Team {
    pub id: Uuid,
    pub title: String,
}

#[cfg_attr(test, allow(dead_code))]
pub struct TeamRepo {}

#[cfg_attr(test, allow(dead_code))]
impl TeamRepo {
    pub async fn create<'c, E>(title: &str, executor: E) -> Result<Team>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let group = sqlx::query_file_as!(Team, "sql/teams/create.sql", title)
            .fetch_one(executor)
            .await?;

        Ok(group)
    }

    pub async fn members<'c, E>(id: Uuid, executor: E) -> Result<Vec<User>>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let users = sqlx::query_file_as!(User, "sql/teams/members.sql", id)
            .fetch_all(executor)
            .await?;

        Ok(users)
    }

    pub async fn members_difference<'c, E>(id_a: Uuid, id_b: Uuid, executor: E) -> Result<Vec<User>>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let users = sqlx::query_file_as!(User, "sql/teams/members_difference.sql", id_a, id_b)
            .fetch_all(executor)
            .await?;

        Ok(users)
    }

    pub async fn is_member<'c, E>(team_id: Uuid, user_id: Uuid, executor: E) -> Result<bool>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let found = sqlx::query_file!("sql/teams/is_member.sql", team_id, user_id)
            .fetch_optional(executor)
            .await?;

        Ok(found.is_some())
    }

    pub async fn add_member<'c, E>(team_id: Uuid, user_id: Uuid, executor: E) -> Result<()>
    where
        E: Executor<'c, Database = Postgres>,
    {
        sqlx::query_file!("sql/teams/add_member.sql", team_id, user_id)
            .execute(executor)
            .await?;

        Ok(())
    }

    pub async fn remove_member<'c, E>(team_id: Uuid, user_id: Uuid, executor: E) -> Result<()>
    where
        E: Executor<'c, Database = Postgres>,
    {
        sqlx::query_file!("sql/teams/remove_member.sql", team_id, user_id)
            .execute(executor)
            .await?;

        Ok(())
    }
}

#[cfg(test)]
pub struct TeamRepoFake {}
#[cfg(test)]
use std::collections::HashSet;
#[cfg(test)]
use std::sync::{Arc, Mutex};

#[cfg(test)]
lazy_static::lazy_static! {
    static ref TEAM_MEMBERS: Arc<Mutex<HashSet<(Uuid, Uuid)>>> = Arc::new(Mutex::new(HashSet::new()));
}

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
impl TeamRepoFake {
    #[allow(dead_code)]
    pub async fn create<'c, E>(title: &str, _executor: E) -> Result<Team>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let team = Team {
            id: Uuid::new_v4(),
            title: title.to_string(),
        };
        Ok(team)
    }

    pub async fn members<'c, E>(id: Uuid, executor: E) -> Result<Vec<User>>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let users = vec![crate::db::UserRepo::find_by_auth_id(&id, executor).await?];

        Ok(users)
    }
    pub async fn members_difference<'c, E>(
        id_a: Uuid,
        _id_b: Uuid,
        executor: E,
    ) -> Result<Vec<User>>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let users = vec![crate::db::UserRepo::find_by_auth_id(&id_a, executor).await?];

        Ok(users)
    }

    pub async fn is_member<'c, E>(team_id: Uuid, user_id: Uuid, _executor: E) -> Result<bool>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let teams = TEAM_MEMBERS.clone();
        let teams = teams.lock().unwrap();
        Ok(teams.contains(&(team_id, user_id)))
    }

    pub async fn add_member<'c, E>(team_id: Uuid, user_id: Uuid, _executor: E) -> Result<()>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let teams = TEAM_MEMBERS.clone();
        let mut teams = teams.lock().unwrap();
        teams.replace((team_id, user_id));
        Ok(())
    }

    pub async fn remove_member<'c, E>(team_id: Uuid, user_id: Uuid, _executor: E) -> Result<()>
    where
        E: Executor<'c, Database = Postgres>,
    {
        let teams = TEAM_MEMBERS.clone();
        let mut teams = teams.lock().unwrap();
        teams.remove(&(team_id, user_id));
        Ok(())
    }
}
