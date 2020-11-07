// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use anyhow::Result;
use sqlx::types::Uuid;
use sqlx::PgPool;

#[derive(Clone)]
pub struct User {
    pub id: Uuid,
    pub auth_id: Uuid,
    pub name: String,
    pub is_platform_admin: bool,
    pub email_address: String,
}

#[cfg_attr(test, allow(dead_code))]
pub struct UserRepo {}

#[cfg_attr(test, allow(dead_code))]
impl UserRepo {
    pub async fn find_by_auth_id(auth_id: &Uuid, pool: &PgPool) -> Result<Option<User>> {
        let user = sqlx::query_file_as!(User, "sql/users/find_by_auth_id.sql", auth_id)
            .fetch_optional(pool)
            .await?;

        Ok(user)
    }

    pub async fn find_by_id(id: &Uuid, pool: &PgPool) -> Result<Option<User>> {
        let user = sqlx::query_file_as!(User, "sql/users/find_by_id.sql", id)
            .fetch_optional(pool)
            .await?;

        Ok(user)
    }

    pub async fn get_or_create(
        auth_id: &Uuid,
        name: &str,
        email_address: &str,
        pool: &PgPool,
    ) -> Result<User> {
        let user = sqlx::query_file_as!(
            User,
            "sql/users/get_or_create.sql",
            auth_id,
            name,
            email_address
        )
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
pub struct UserRepoFake {}

#[cfg(test)]
use std::collections::HashMap;
#[cfg(test)]
use std::sync::Mutex;

#[cfg(test)]
lazy_static::lazy_static! {
    static ref USERS_BY_ID: Mutex<HashMap<Uuid, User>> = Mutex::new(HashMap::new());
    static ref USERS_BY_AUTH_ID: Mutex<HashMap<Uuid, User>> = Mutex::new(HashMap::new());
}

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
impl UserRepoFake {
    pub async fn find_by_auth_id(auth_id: &Uuid, _pool: impl Sized) -> Result<Option<User>> {
        let users = USERS_BY_AUTH_ID.lock().unwrap();
        Ok(users.get(auth_id).cloned())
    }

    pub async fn find_by_id(id: &Uuid, _pool: &PgPool) -> Result<Option<User>> {
        let users = USERS_BY_ID.lock().unwrap();
        Ok(users.get(id).cloned())
    }

    pub async fn get_or_create(
        auth_id: &Uuid,
        name: &str,
        email_address: &str,
        pool: impl Sized,
    ) -> Result<User> {
        const ADMIN_AUTH_ID: &str = "feedface-0000-0000-0000-000000000000";
        let user = if let Ok(Some(user)) = UserRepoFake::find_by_auth_id(auth_id, pool).await {
            user
        } else {
            let user = User {
                id: Uuid::new_v4(),
                auth_id: *auth_id,
                name: name.to_string(),
                is_platform_admin: auth_id.to_string() == ADMIN_AUTH_ID,
                email_address: email_address.to_string(),
            };
            let mut users = USERS_BY_ID.lock().unwrap();
            users.insert(user.id, user.clone());
            let mut users = USERS_BY_AUTH_ID.lock().unwrap();
            users.insert(user.auth_id, user.clone());
            user
        };

        Ok(user)
    }

    pub async fn update(
        auth_id: &Uuid,
        is_platform_admin: bool,
        _pool: impl Sized,
    ) -> Result<User> {
        let mut users = USERS_BY_AUTH_ID.lock().unwrap();
        let user = users.get_mut(auth_id).unwrap();
        user.is_platform_admin = is_platform_admin;
        Ok(user.clone())
    }
}
