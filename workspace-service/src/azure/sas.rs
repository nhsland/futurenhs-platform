use super::Config;
use anyhow::{anyhow, Result};
use azure_sdk_storage_core::prelude::*;
use chrono::*;
use url::Url;
use uuid::Uuid;

pub fn create_upload_sas(config: &Config, name: &Uuid) -> Result<Url> {
    create_upload_sas_impl(config, name, Utc::now())
}

pub fn create_download_sas(config: &Config, url: &Url) -> Result<Url> {
    create_download_sas_impl(config, url, Utc::now())
}

fn create_upload_sas_impl(config: &Config, name: &Uuid, now: DateTime<Utc>) -> Result<Url> {
    let start = now - Duration::minutes(15);
    let end = now + Duration::minutes(15);

    let mut url = config.upload_container_url.clone();
    url.path_segments_mut()
        .map_err(|_| anyhow!("cannot be base"))?
        .push(&name.to_string());

    let sas = if url.host_str() == Some("127.0.0.1") {
        // Workaround for local Azurite, which uses the following URL scheme:
        // http://127.0.0.1:10000/<account>/<container>/<blob>
        // The Azure SDK for Rust assumes it to be:
        // http://<account>.some.domain/<container>/<blob>
        let mut path_segments = url
            .path_segments()
            .expect("upload container url should have a path");
        let account = path_segments
            .next()
            .expect("upload container url should have a path");
        let path = path_segments.collect::<Vec<&str>>().join("/");
        let mut workaround_url = url.clone();
        workaround_url.set_host(Some(&format!("{}.some.domain", account)))?;
        workaround_url.set_path(&path);
        let sas = BlobSASBuilder::new(&workaround_url)
            .with_key(&config.access_key)
            .with_validity_start(&start)
            .with_validity_end(&end)
            .allow_write()
            .finalize();
        url.set_query(sas.query());
        url
    } else {
        BlobSASBuilder::new(&url)
            .with_key(&config.access_key)
            .with_validity_start(&start)
            .with_validity_end(&end)
            .allow_write()
            .finalize()
    };

    Ok(sas)
}

fn create_download_sas_impl(config: &Config, url: &Url, now: DateTime<Utc>) -> Result<Url> {
    let start = now - Duration::minutes(15);
    let end = now + Duration::minutes(15);

    let sas = if url.host_str() == Some("127.0.0.1") {
        // Workaround for local Azurite, which uses the following URL scheme:
        // http://127.0.0.1:10000/<account>/<container>/<blob>
        // The Azure SDK for Rust assumes it to be:
        // http://<account>.some.domain/<container>/<blob>
        let mut path_segments = url
            .path_segments()
            .expect("upload container url should have a path");
        let account = path_segments
            .next()
            .expect("upload container url should have a path");
        let path = path_segments.collect::<Vec<&str>>().join("/");
        let mut workaround_url = url.clone();
        workaround_url.set_host(Some(&format!("{}.some.domain", account)))?;
        workaround_url.set_path(&path);
        let sas = BlobSASBuilder::new(&workaround_url)
            .with_key(&config.access_key)
            .with_validity_start(&start)
            .with_validity_end(&end)
            .allow_read()
            .finalize();
        let mut url = url.to_owned();
        url.set_query(sas.query());
        url
    } else {
        BlobSASBuilder::new(&url)
            .with_key(&config.access_key)
            .with_validity_start(&start)
            .with_validity_end(&end)
            .allow_read()
            .finalize()
    };

    Ok(sas)
}

#[cfg(test)]
mod tests {
    use super::*;
    use percent_encoding::*;

    // the key below has been revoked ...
    const ACCESS_KEY: &str =
        "LS6VHq43aBFjcwpAEK2hn3jUKraeFcR6OrtOM3VpBO81SgbSZ8ebu0CznxrrYF59dHVaUypuPdZy26SRc/CJJQ==";
    const UPLOAD_CONTAINER_URL: &str = "https://fnhsfilesdevstu.blob.core.windows.net/upload";
    const FILES_CONTAINER_URL: &str = "https://fnhsfilesdevstu.blob.core.windows.net/files";

    #[test]
    fn should_create_correct_upload_sas() {
        let uuid = Uuid::new_v4();
        let now = Utc::now();

        let config = Config::new(
            ACCESS_KEY.to_string(),
            Url::parse(UPLOAD_CONTAINER_URL).unwrap(),
            Url::parse(FILES_CONTAINER_URL).unwrap(),
        );
        let actual = create_upload_sas_impl(&config, &uuid, now).unwrap();

        let sig = actual
            .query_pairs()
            .into_owned()
            .find(|v| v.0 == "sig")
            .unwrap()
            .1;
        let sig = percent_encode(sig.as_bytes(), NON_ALPHANUMERIC);
        let actual = actual.to_string();

        let start = (now - Duration::minutes(15))
            .to_rfc3339_opts(SecondsFormat::Secs, true)
            .replace(":", "%3A");
        let end = (now + Duration::minutes(15))
            .to_rfc3339_opts(SecondsFormat::Secs, true)
            .replace(":", "%3A");

        let expected =
            format!(
                "https://fnhsfilesdevstu.blob.core.windows.net/upload/{}?st={}&se={}&sp=w&sr=b&spr=https&sv=2019-02-02&sig={}",
                uuid,
                start,
                end,
                sig
            );
        let expected = Url::parse(&expected).unwrap().to_string();

        assert_eq!(actual, expected);
    }

    #[test]
    fn should_create_correct_download_sas() {
        let url = Url::parse("https://fnhsfilesdevstu.blob.core.windows.net/files/16005b24-7a13-4aec-9317-b088f0f78cf9").unwrap();
        let now = Utc::now();

        let config = Config::new(
            ACCESS_KEY.to_string(),
            Url::parse(UPLOAD_CONTAINER_URL).unwrap(),
            Url::parse(FILES_CONTAINER_URL).unwrap(),
        );
        let actual = create_download_sas_impl(&config, &url, now).unwrap();

        let sig = actual
            .query_pairs()
            .into_owned()
            .find(|v| v.0 == "sig")
            .unwrap()
            .1;
        let sig = percent_encode(sig.as_bytes(), NON_ALPHANUMERIC);
        let actual = actual.to_string();

        let start = (now - Duration::minutes(15))
            .to_rfc3339_opts(SecondsFormat::Secs, true)
            .replace(":", "%3A");
        let end = (now + Duration::minutes(15))
            .to_rfc3339_opts(SecondsFormat::Secs, true)
            .replace(":", "%3A");

        let expected = format!(
            "{}?st={}&se={}&sp=r&sr=b&spr=https&sv=2019-02-02&sig={}",
            url, start, end, sig
        );
        let expected = Url::parse(&expected).unwrap().to_string();

        assert_eq!(actual, expected);
    }
}
