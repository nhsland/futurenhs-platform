mod file_versions;
mod files;
mod folders;
mod teams;
mod users;
mod workspaces;

pub use file_versions::*;
pub use files::*;
pub use folders::*;
pub use teams::*;
pub use users::*;
pub use workspaces::*;
#[cfg(not(test))]
use {
    anyhow::Result,
    sqlx::{Executor, Postgres},
};

#[cfg(not(test))]
async fn defer_all_constraints<'c, E>(executor: E) -> Result<()>
where
    E: Executor<'c, Database = Postgres>,
{
    sqlx::query!("SET CONSTRAINTS ALL DEFERRED;")
        .execute(executor)
        .await?;
    Ok(())
}
