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

    let token = config
        .client()
        .shared_access_signature()
        .with_start(start)
        .with_expiry(end)
        .with_permissions(SasPermissions::Write)
        .with_resource(SasResource::Blob)
        .with_resource_type(SasResourceType::Object)
        .with_protocol(if config.is_emulator() {
            SasProtocol::HttpHttps
        } else {
            SasProtocol::Https
        })
        .finalize()
        .token();

    let mut url = config.upload_container_url.clone();
    url.path_segments_mut()
        .map_err(|_| anyhow!("cannot be base"))?
        .push(&name.to_string());
    url.set_query(Some(&token));

    Ok(url)
}

fn create_download_sas_impl(config: &Config, url: &Url, now: DateTime<Utc>) -> Result<Url> {
    let start = now - Duration::minutes(15);
    let end = now + Duration::minutes(15);

    let token = config
        .client()
        .shared_access_signature()
        .with_start(start)
        .with_expiry(end)
        .with_permissions(SasPermissions::Read)
        .with_resource(SasResource::Blob)
        .with_resource_type(SasResourceType::Object)
        .with_protocol(if config.is_emulator() {
            SasProtocol::HttpHttps
        } else {
            SasProtocol::Https
        })
        .finalize()
        .token();

    let mut url = url.clone();
    url.set_query(Some(&token));

    Ok(url)
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
        )
        .unwrap();
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
                "https://fnhsfilesdevstu.blob.core.windows.net/upload/{}?sv=2018-11-09&ss=b&srt=o&se={}&sp=w&st={}&spr=https&sig={}",
                uuid,
                end,
                start,
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
        )
        .unwrap();
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
            "{}?sv=2018-11-09&ss=b&srt=o&se={}&sp=r&st={}&spr=https&sig={}",
            url, end, start, sig
        );
        let expected = Url::parse(&expected).unwrap().to_string();

        assert_eq!(actual, expected);
    }
}
