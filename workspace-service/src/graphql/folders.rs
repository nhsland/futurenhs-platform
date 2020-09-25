use super::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use fnhs_event_models::{Event, EventClient, EventPublisher, FolderCreatedData};
use sqlx::PgPool;
use uuid::Uuid;

#[SimpleObject(desc = "A folder")]
pub struct Folder {
    #[field(desc = "The id of the folder")]
    id: ID,
    #[field(desc = "The title of the folder")]
    title: String,
    #[field(desc = "The description of the folder")]
    description: String,
    #[field(desc = "The workspace that this folder is in")]
    workspace: ID,
}

impl From<db::Folder> for Folder {
    fn from(d: db::Folder) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
            workspace: d.workspace.into(),
        }
    }
}

#[InputObject]
struct NewFolder {
    title: String,
    description: String,
    workspace: ID,
}

#[InputObject]
struct UpdateFolder {
    title: String,
    description: String,
}

#[derive(Default)]
pub struct FoldersQuery;

#[Object]
impl FoldersQuery {
    #[field(desc = "Get all Folders in a workspace")]
    async fn folders_by_workspace(
        &self,
        context: &Context<'_>,
        workspace: ID,
    ) -> FieldResult<Vec<Folder>> {
        let pool = context.data()?;
        let workspace = Uuid::parse_str(&workspace)?;
        let folders = db::Folder::find_by_workspace(workspace, pool).await?;
        Ok(folders.into_iter().map(Into::into).collect())
    }

    #[field(desc = "Get folder by ID")]
    async fn folder(&self, context: &Context<'_>, id: ID) -> FieldResult<Folder> {
        self.get_folder(context, id).await
    }

    #[entity]
    async fn get_folder(&self, context: &Context<'_>, id: ID) -> FieldResult<Folder> {
        let pool = context.data()?;
        let id = Uuid::parse_str(&id)?;
        let folder = db::Folder::find_by_id(id, pool).await?;
        Ok(folder.into())
    }
}

#[derive(Default)]
pub struct FoldersMutation;

#[Object]
impl FoldersMutation {
    #[field(desc = "Create a new folder (returns the created folder)")]
    async fn create_folder(
        &self,
        context: &Context<'_>,
        new_folder: NewFolder,
    ) -> FieldResult<Folder> {
        let pool = context.data()?;
        let workspace = Uuid::parse_str(&new_folder.workspace)?;
        let event_client: &EventClient = context.data()?;

        create_folder(
            &new_folder.title,
            &new_folder.description,
            workspace,
            pool,
            event_client,
        )
        .await
    }

    #[field(desc = "Update folder (returns updated folder")]
    async fn update_folder(
        &self,
        context: &Context<'_>,
        id: ID,
        folder: UpdateFolder,
    ) -> FieldResult<Folder> {
        // TODO: Add event
        let pool = context.data()?;
        let folder = db::Folder::update(
            Uuid::parse_str(&id)?,
            &folder.title,
            &folder.description,
            pool,
        )
        .await?;

        Ok(folder.into())
    }

    #[field(desc = "Delete folder (returns deleted folder")]
    async fn delete_folder(&self, context: &Context<'_>, id: ID) -> FieldResult<Folder> {
        // TODO: Add event
        let pool = context.data()?;
        let folder = db::Folder::delete(Uuid::parse_str(&id)?, pool).await?;

        Ok(folder.into())
    }
}

async fn create_folder(
    title: &str,
    description: &str,
    workspace: Uuid,
    pool: &PgPool,
    event_client: &EventClient,
) -> FieldResult<Folder> {
    // TODO: Add event
    let folder: Folder = db::Folder::create(&title, &description, workspace, pool)
        .await?
        .into();

    event_client
        .publish_events(&[Event::new(
            folder.id.clone(),
            FolderCreatedData {
                folder_id: folder.id.clone().into(),
                workspace_id: folder.workspace.clone().into(),
                // TODO: Fill this in when we have users in the db.
                user_id: "".into(),
                title: folder.title.clone(),
            },
        )])
        .await?;
    Ok(folder)
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::graphql::test_helpers::*;
    use fnhs_event_models::EventData;

    #[async_std::test]
    async fn creating_folder_emits_an_event() -> anyhow::Result<()> {
        let pool = mock_connection_pool().await?;
        let (events, event_client) = mock_event_emitter();

        let folder = create_folder("title", "description", Uuid::new_v4(), &pool, &event_client)
            .await
            .unwrap();

        assert_eq!(folder.title, "title");
        assert_eq!(folder.description, "description");

        assert!(events
            .try_iter()
            .any(|e| matches!(e.data, EventData::FolderCreated(_))));

        Ok(())
    }
}
