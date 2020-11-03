use super::azure;
use super::db;
use async_graphql::{Context, FieldResult, Object, ID};
use fnhs_event_models::{Event, EventClient, EventPublisher as _, FileDownloadedData};
use url::Url;
use uuid::Uuid;

#[derive(Default)]
pub struct FileDownloadUrlsMutation;

#[Object]
impl FileDownloadUrlsMutation {
    /// Get a file download URL
    async fn file_download_url(&self, context: &Context<'_>, id: ID) -> FieldResult<Url> {
        let pool = context.data()?;
        let config = context.data()?;
        let event_client: &EventClient = context.data()?;
        let requesting_user = context.data::<super::RequestingUser>()?;
        let user = db::UserRepo::find_by_auth_id(&requesting_user.auth_id, pool).await?;
        let id = Uuid::parse_str(&id)?;
        let file = db::FileWithVersionRepo::find_by_id(id, pool).await?;
        let folder = db::FolderRepo::find_by_id(file.folder, pool).await?;

        event_client
            .publish_events(&[Event::new(
                id.to_string(),
                FileDownloadedData {
                    file_id: file.id.to_string(),
                    user_id: user.id.to_string(),
                    version_number: file.version_number.into(),
                    version_id: file.version.to_string(),
                    workspace_id: folder.workspace.to_string(),
                },
            )])
            .await?;

        Ok(azure::create_download_sas(
            config,
            &file.blob_storage_path.parse()?,
        )?)
    }
}
