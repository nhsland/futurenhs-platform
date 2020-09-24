pub use upload::create_upload_sas;
use url::Url;

mod upload;

#[derive(Debug, Clone)]
pub struct Config {
    pub access_key: String,
    pub container_url: Url,
}

impl Config {
    pub fn new(access_key: String, container_url: Url) -> Self {
        Self {
            access_key,
            container_url,
        }
    }
}
