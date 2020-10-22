use super::azure;
use super::db;
use async_graphql::{Context, FieldResult, Object, ID};
use url::Url;
use uuid::Uuid;

#[derive(Default)]
pub struct FileDownloadUrlsQuery;

#[Object]
impl FileDownloadUrlsQuery {
    /// Get a file download URL
    async fn file_download_url(&self, context: &Context<'_>, id: ID) -> FieldResult<Url> {
        let pool = context.data()?;
        let config = context.data()?;
        let id = Uuid::parse_str(&id)?;
        let file = db::File::find_by_id(id, pool).await?;

        Ok(azure::create_download_sas(
            config,
            &file.blob_storage_path.parse()?,
        )?)
    }
}
