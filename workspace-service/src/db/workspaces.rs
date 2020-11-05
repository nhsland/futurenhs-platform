// sqlx::query_file_as!() causes spurious errors with this lint enabled
#![allow(clippy::suspicious_else_formatting)]

use crate::db;
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

pub enum Role {
    /// Promote to admin.
    Admin,
    /// Add as a non-admin member or demote an admin.
    NonAdmin,
    /// Remove member.
    NonMember,
}

#[cfg_attr(test, allow(dead_code))]
pub struct WorkspaceRepo {}

#[cfg_attr(test, allow(dead_code))]
impl WorkspaceRepo {
    pub async fn create(title: &str, description: &str, pool: &PgPool) -> Result<Workspace> {
        let mut tx = pool.begin().await?;

        let admins = db::TeamRepo::create(&format!("{} Admins", title), &mut tx).await?;
        let members = db::TeamRepo::create(&format!("{} Members", title), &mut tx).await?;

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

    pub async fn is_admin(workspace_id: Uuid, user_id: Uuid, pool: &PgPool) -> Result<bool> {
        let user = db::UserRepo::find_by_id(&user_id, pool).await?;
        if user.is_platform_admin {
            return Ok(true);
        }
        let workspace = WorkspaceRepo::find_by_id(workspace_id, pool).await?;

        db::TeamRepo::is_member(workspace.admins, user.id, pool).await
    }

    pub async fn change_workspace_membership(
        workspace_id: Uuid,
        user_id: Uuid,
        new_role: Role,
        pool: &PgPool,
    ) -> Result<Workspace> {
        let workspace = WorkspaceRepo::find_by_id(workspace_id, pool).await?;
        let mut tx = pool.begin().await?;

        match new_role {
            Role::Admin => {
                db::TeamRepo::add_member(workspace.admins, user_id, &mut tx).await?;
                db::TeamRepo::add_member(workspace.members, user_id, &mut tx).await?;
            }
            Role::NonAdmin => {
                db::TeamRepo::remove_member(workspace.admins, user_id, &mut tx).await?;
                db::TeamRepo::add_member(workspace.members, user_id, &mut tx).await?;
            }
            Role::NonMember => {
                db::TeamRepo::remove_member(workspace.admins, user_id, &mut tx).await?;
                db::TeamRepo::remove_member(workspace.members, user_id, &mut tx).await?;
            }
        }

        tx.commit().await?;

        Ok(workspace)
    }
}

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
pub struct WorkspaceRepoFake {}

#[cfg(test)]
use std::collections::HashMap;
#[cfg(test)]
use std::sync::{Arc, Mutex};

#[cfg(test)]
lazy_static::lazy_static! {
    static ref TEAM_MEMBERS: Arc<Mutex<HashMap<Uuid, Workspace>>> = Arc::new(Mutex::new(HashMap::new()));
}

#[cfg(test)]
impl WorkspaceRepoFake {
    pub async fn create(title: &str, description: &str, _pool: &PgPool) -> Result<Workspace> {
        let workspace = Workspace {
            id: Uuid::new_v4(),
            title: title.to_string(),
            description: description.to_string(),
            admins: Uuid::new_v4(),
            members: Uuid::new_v4(),
        };
        let teams = TEAM_MEMBERS.clone();
        let mut teams = teams.lock().unwrap();
        teams.insert(workspace.id, workspace.clone());
        Ok(workspace)
    }

    pub async fn find_all(_pool: &PgPool) -> Result<Vec<Workspace>> {
        Ok(vec![])
    }

    pub async fn find_by_id(id: Uuid, _pool: &PgPool) -> Result<Workspace> {
        let teams = TEAM_MEMBERS.clone();
        let teams = teams.lock().unwrap();
        Ok(teams.get(&id).unwrap().clone())
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

    pub async fn is_admin(workspace_id: Uuid, user_auth_id: Uuid, pool: &PgPool) -> Result<bool> {
        let user = db::UserRepo::find_by_auth_id(&user_auth_id, pool).await?;
        if user.is_platform_admin {
            return Ok(true);
        }
        let workspace = WorkspaceRepoFake::find_by_id(workspace_id, pool).await?;

        db::TeamRepo::is_member(workspace.admins, user.id, pool).await
    }

    pub async fn change_workspace_membership(
        workspace_id: Uuid,
        user_id: Uuid,
        new_role: Role,
        pool: &PgPool,
    ) -> Result<Workspace> {
        let workspace = WorkspaceRepoFake::find_by_id(workspace_id, pool).await?;
        match new_role {
            Role::Admin => {
                db::TeamRepo::add_member(workspace.admins, user_id, pool).await?;
                db::TeamRepo::add_member(workspace.members, user_id, pool).await?;
            }
            Role::NonAdmin => {
                db::TeamRepo::remove_member(workspace.admins, user_id, pool).await?;
                db::TeamRepo::add_member(workspace.members, user_id, pool).await?;
            }
            Role::NonMember => {
                db::TeamRepo::remove_member(workspace.admins, user_id, pool).await?;
                db::TeamRepo::remove_member(workspace.members, user_id, pool).await?;
            }
        }

        Ok(workspace)
    }
}
