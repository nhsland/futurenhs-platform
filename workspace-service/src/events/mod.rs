use crate::db;
use anyhow::Result;
use fnhs_event_models::{CreateWorkspaceEventDataInput, CreateWorkspaceEventDataInputOutput};
use sqlx::PgPool;

impl From<db::Workspace> for CreateWorkspaceEventDataInputOutput {
    fn from(workspace: db::Workspace) -> Self {
        Self {
            id: workspace.id.to_string(),
            title: workspace.title,
            description: workspace.description,
        }
    }
}

pub async fn create_workspace(
    input: CreateWorkspaceEventDataInput,
    pool: &PgPool,
) -> Result<CreateWorkspaceEventDataInputOutput> {
    Ok(db::Workspace::create(input.title, input.description, pool)
        .await?
        .into())
}
