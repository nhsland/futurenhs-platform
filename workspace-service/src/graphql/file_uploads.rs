use super::azure;
use async_graphql::{Context, FieldResult, Object};
use url::Url;
use uuid::Uuid;

#[derive(Default)]
pub struct FileUploadQuery;

#[Object]
impl FileUploadQuery {
    /// Get a file upload URL
    async fn file_upload_url(&self, context: &Context<'_>) -> FieldResult<Url> {
        let config = context.data()?;
        let name = Uuid::new_v4();

        let sas = azure::create_upload_sas(config, &name)?;

        Ok(sas)
    }
}
