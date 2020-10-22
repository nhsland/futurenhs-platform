mod file_versions;
mod files;
mod folders;
mod users;
mod workspaces;

use anyhow::Result;
pub use file_versions::*;
pub use files::*;
pub use folders::*;
use sqlx::{Executor, Postgres};
pub use users::*;
pub use workspaces::*;

pub async fn defer_all_constraints<'c, E>(executor: E) -> Result<()>
where
    E: Executor<'c, Database = Postgres>,
{
    sqlx::query!("SET CONSTRAINTS ALL DEFERRED;")
        .execute(executor)
        .await?;
    Ok(())
}
