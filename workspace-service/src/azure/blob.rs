use anyhow::{anyhow, Result};
use std::convert::{TryFrom, TryInto};
use url::Url;
#[cfg(not(test))]
use {
    anyhow::bail,
    async_compat::Compat,
    azure_sdk_core::prelude::*,
    azure_sdk_storage_blob::{blob::CopyStatus, Blob},
    azure_sdk_storage_core::prelude::*,
};

#[derive(PartialEq, Debug)]
struct FileParts {
    account: String,
    container: String,
    blob: Option<String>,
}

impl TryFrom<&Url> for FileParts {
    type Error = anyhow::Error;

    fn try_from(value: &Url) -> Result<Self, Self::Error> {
        let mut path_segments = value
            .path_segments()
            .ok_or_else(|| anyhow!("url has no path"))?;

        let account = if value.host_str() == Some("127.0.0.1") {
            path_segments
                .next()
                .ok_or_else(|| anyhow!("cannot get account from url"))?
                .to_string()
        } else {
            let host = value
                .host()
                .ok_or_else(|| anyhow!("cannot get host from url"))?
                .to_string();
            host.split('.')
                .next()
                .ok_or_else(|| anyhow!("cannot get storage account from url"))?
                .to_string()
        };

        let container = path_segments
            .next()
            .ok_or_else(|| anyhow!("cannot get container name from url"))?
            .to_string();
        let blob = path_segments.next().map(|s| s.to_string());

        Ok(Self {
            account,
            container,
            blob,
        })
    }
}

#[cfg(not(test))]
pub async fn copy_blob_from_url(url: &Url, azure_config: &super::Config) -> Result<String> {
    let input: FileParts = url.try_into()?;
    let target: FileParts = (&azure_config.files_container_url).try_into()?;
    let source: FileParts = (&azure_config.upload_container_url).try_into()?;

    if input.account != source.account {
        bail!("source file is from an unsupported storage account");
    }

    if input.container != source.container {
        bail!("source file is from an unsupported container");
    }

    let mut source_url = url.clone();
    source_url.set_query(None);
    let source_url = super::create_download_sas(azure_config, &source_url)?;

    let target_blob = input
        .blob
        .ok_or_else(|| anyhow!("cannot get blob name from url"))?;

    let client = if target.account == "devstoreaccount1" {
        client::with_emulator(
            &Url::parse("http://127.0.0.1:10000").unwrap(),
            &Url::parse("http://127.0.0.1:10001").unwrap(),
        )
    } else {
        client::with_access_key(&target.account, &azure_config.access_key)
    };
    let response = Compat::new(
        client
            .copy_blob_from_url()
            .with_container_name(&target.container)
            .with_blob_name(&target_blob)
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
        _ => bail!("Sync copy did not complete: {}", response.copy_status),
    }
}

// Fake implementation for tests. If you want integration tests that exercise the database,
// see https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html.
#[cfg(test)]
pub async fn copy_blob_from_url(_url: &Url, _azure_config: &super::Config) -> Result<String> {
    Ok("http://localhost:10000/devstoreaccount1/files/fake".into())
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn extract_from_url() {
        let url =
            &Url::parse("https://fnhsfilesdevstu.blob.core.windows.net/upload/my_blob").unwrap();
        let actual: FileParts = url.try_into().unwrap();
        let expected = FileParts {
            account: "fnhsfilesdevstu".to_string(),
            container: "upload".to_string(),
            blob: Some("my_blob".to_string()),
        };
        assert_eq!(actual, expected);
    }

    #[test]
    fn extract_from_url_without_blob() {
        let url = &Url::parse("https://fnhsfilesdevstu.blob.core.windows.net/upload").unwrap();
        let actual: FileParts = url.try_into().unwrap();
        let expected = FileParts {
            account: "fnhsfilesdevstu".to_string(),
            container: "upload".to_string(),
            blob: None,
        };
        assert_eq!(actual, expected);
    }
}
