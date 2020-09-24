use structopt::StructOpt;
use url::Url;

#[derive(Debug, Clone, StructOpt)]
pub struct Config {
    /// Immediately exit, can be used to check that the service is configured and will run
    #[structopt(long)]
    pub selfcheck_only: bool,

    /// Key for OpenTelemetry exporter
    #[structopt(long, env = "INSTRUMENTATION_KEY", hide_env_values = true)]
    pub instrumentation_key: Option<String>,

    /// The URL for the Postgres database
    #[structopt(
        long,
        env = "DATABASE_URL",
        parse(try_from_str = str::parse),
        required_unless("selfcheck-only"),
        hide_env_values = true
    )]
    pub database_url: Option<Url>,

    /// Endpoint for the Azure EventGrid topic
    #[structopt(
        long,
        env = "EVENTGRID_TOPIC_ENDPOINT",
        parse(try_from_str = str::parse),
    )]
    pub eventgrid_topic_endpoint: Option<Url>,

    /// Key for the Azure EventGrid topic
    #[structopt(long, env = "EVENTGRID_TOPIC_KEY", hide_env_values = true)]
    pub eventgrid_topic_key: Option<String>,

    /// The Azure Blob Storage Account key for file uploads
    #[structopt(
        long,
        env = "UPLOAD_MASTER_KEY",
        hide_env_values = true,
        required_unless("selfcheck-only")
    )]
    pub master_key: Option<String>,

    /// The Azure Blob Storage Container URL for file uploads
    #[structopt(
        long,
        env = "UPLOAD_CONTAINER_URL",
        parse(try_from_str = str::parse),
        required_unless("selfcheck-only")
    )]
    pub container_url: Option<Url>,
}
