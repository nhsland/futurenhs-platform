use anyhow::Result;
use azure_sdk_storage_core::prelude::*;
use chrono::*;
use url::Url;

pub fn create_upload_sas(master_key: &str, container_url: Url) -> Result<Url> {
    let start = Utc::now() - Duration::days(1);
    let end = Utc::now() + Duration::days(1);

    let filename = "test_file.pdf";
    let path = container_url.join(filename)?;

    let ip_range = IPRange {
        start: std::net::IpAddr::V4(<std::net::Ipv4Addr>::new(0, 0, 0, 0)),
        end: std::net::IpAddr::V4(<std::net::Ipv4Addr>::new(255, 255, 255, 255)),
    };

    let sas = BlobSASBuilder::new(&path)
        .with_key(&master_key)
        .with_validity_start(&start)
        .with_validity_end(&end)
        .with_ip_range(&ip_range)
        .with_content_type("text/plain")
        .allow_read()
        .finalize();

    Ok(sas)
}
