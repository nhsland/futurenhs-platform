use super::Config;
use anyhow::Result;
use azure_sdk_storage_core::prelude::*;
use chrono::*;
use url::Url;
use uuid::Uuid;

pub fn create_upload_sas(config: Config, name: &Uuid) -> Result<Url> {
    create_upload_sas_impl(config, name, Utc::now())
}

fn create_upload_sas_impl(config: Config, name: &Uuid, now: DateTime<Utc>) -> Result<Url> {
    let start = now - Duration::minutes(15);
    let end = now + Duration::minutes(15);

    let container_url = Url::parse(&format!("{}/", config.container_url))?;
    let path = container_url.join(&name.to_string())?;

    let ip_range = IPRange {
        start: std::net::IpAddr::V4(<std::net::Ipv4Addr>::new(0, 0, 0, 0)),
        end: std::net::IpAddr::V4(<std::net::Ipv4Addr>::new(255, 255, 255, 255)),
    };

    let sas = BlobSASBuilder::new(&path)
        .with_key(&config.master_key)
        .with_validity_start(&start)
        .with_validity_end(&end)
        .with_ip_range(&ip_range)
        .with_content_type("application/octet-stream")
        .allow_write()
        .finalize();

    Ok(sas)
}

#[cfg(test)]
mod tests {
    use super::*;
    use percent_encoding::*;
    #[test]
    fn should_create_correct_upload_sas() {
        let uuid = Uuid::new_v4();
        let now = Utc::now();

        // the key below has been revoked ...
        let actual = create_upload_sas_impl(Config::new(
            "LS6VHq43aBFjcwpAEK2hn3jUKraeFcR6OrtOM3VpBO81SgbSZ8ebu0CznxrrYF59dHVaUypuPdZy26SRc/CJJQ==".to_string(),
            Url::parse("https://fnhsnonproduploadstu.blob.core.windows.net/waiting").unwrap(),
        ),&uuid, now).unwrap();

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
                "https://fnhsnonproduploadstu.blob.core.windows.net/waiting/{}?st={}&sip=0.0.0.0-255.255.255.255&rsct=application%2Foctet-stream&se={}&sp=w&sr=b&spr=https&sv=2019-02-02&sig={}",
                uuid,
                start,
                end,
                sig
            );
        let expected = Url::parse(&expected).unwrap().to_string();

        assert_eq!(actual, expected);
    }
}
