use anyhow::{anyhow, Result};
use async_compat::Compat;
use azure_sdk_core::prelude::*;
use azure_sdk_storage_blob::{blob::CopyStatus, Blob};
use azure_sdk_storage_core::prelude::*;
use url::Url;

pub async fn copy_blob_from_url(url: &Url, azure_config: &super::Config) -> Result<String> {
    let target_storage_account = azure_config
        .files_container_url
        .host()
        .expect("invalid files_container_url")
        .to_string();
    let target_storage_account = target_storage_account
        .split('.')
        .next()
        .expect("invalid files_container_url");

    let target_container = azure_config
        .files_container_url
        .path_segments()
        .expect("invalid files_container_url")
        .next()
        .expect("cannot get container name from url");

    let target_blob = url
        .path_segments()
        .ok_or_else(|| anyhow!("invalid temporary_blob_storage_path"))?
        .nth(1)
        .ok_or_else(|| anyhow!("cannot get blob name from temporary_blob_storage_path"))?;

    let mut source_url = url.clone();
    source_url.set_query(None);
    let source_url = super::create_download_sas(azure_config, &source_url)?;

    let client = client::with_access_key(target_storage_account, &azure_config.access_key);
    let response = Compat::new(
        client
            .copy_blob_from_url()
            .with_container_name(&target_container)
            .with_blob_name(target_blob)
            .with_source_url(source_url.as_str())
            .with_is_synchronous(true)
            .finalize(),
    )
    .await?;

    match response.copy_status {
        CopyStatus::Success => Ok(format!(
            "{}/{}",
            azure_config.files_container_url, target_blob
        )),
        _ => Err(anyhow!(
            "Sync copy did not complete: {}",
            response.copy_status
        )),
    }
}
