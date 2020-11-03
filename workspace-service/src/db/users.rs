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
    pub async fn find_by_auth_id(auth_id: &Uuid, pool: &PgPool) -> Result<User> {
        let user = sqlx::query_file_as!(User, "sql/users/find_by_auth_id.sql", auth_id)
            .fetch_one(pool)
            .await?;

        Ok(user)
    }

    pub async fn find_by_id(id: &Uuid, pool: &PgPool) -> Result<User> {
        let user = sqlx::query_file_as!(User, "sql/users/find_by_id.sql", id)
            .fetch_one(pool)
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

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
impl UserRepoFake {
    pub async fn find_by_auth_id(auth_id: &Uuid, _pool: impl Sized) -> Result<User> {
        Ok(User {
            id: Uuid::new_v4(),
            auth_id: *auth_id,
            name: "Test".to_string(),
            is_platform_admin: auth_id.to_string() == "feedface-0000-0000-0000-000000000000",
            email_address: "testuser@example.com".to_string(),
        })
    }

    pub async fn find_by_id(id: &Uuid, _pool: &PgPool) -> Result<User> {
        Ok(User {
            id: *id,
            auth_id: Uuid::new_v4(),
            name: "Test".to_string(),
            is_platform_admin: false,
            email_address: "testuser@example.com".to_string(),
        })
    }

    pub async fn get_or_create(
        auth_id: &Uuid,
        name: &str,
        email_address: &str,
        _pool: impl Sized,
    ) -> Result<User> {
        Ok(User {
            id: Uuid::new_v4(),
            auth_id: *auth_id,
            name: name.to_string(),
            is_platform_admin: auth_id.to_string() == "feedface-0000-0000-0000-000000000000",
            email_address: email_address.to_string(),
        })
    }

    pub async fn update(
        auth_id: &Uuid,
        is_platform_admin: bool,
        _pool: impl Sized,
    ) -> Result<User> {
        Ok(User {
            id: Uuid::new_v4(),
            auth_id: *auth_id,
            name: "Test".to_string(),
            is_platform_admin,
            email_address: "testuser@example.com".to_string(),
        })
    }
}
