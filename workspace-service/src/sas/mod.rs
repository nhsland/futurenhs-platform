pub use upload::create_upload_sas;
use url::Url;

mod upload;

#[derive(Debug, Clone)]
pub struct Config {
    pub master_key: String,
    pub container_url: Url,
}

impl Config {
    pub fn new(master_key: String, container_url: Url) -> Self {
        Self {
            master_key,
            container_url,
        }
    }
}
