use structopt::StructOpt;
use url::Url;

#[derive(Debug, Clone, StructOpt)]
pub struct Config {
    /// Immediately exit, can be used to check that the service is configured and will run
    #[structopt(long)]
    pub selfcheck_only: bool,

    /// Generates a GraphQL schema JSON files using the introspection query, then exits
    #[structopt(long)]
    pub generate_schema_only: bool,

    /// Key for OpenTelemetry exporter
    #[structopt(long, env = "INSTRUMENTATION_KEY", hide_env_values = true)]
    pub instrumentation_key: Option<String>,

    /// The URL for the Postgres database
    #[structopt(
        long,
        env = "DATABASE_URL",
        parse(try_from_str = str::parse),
        hide_env_values = true,
        required_unless_one(&["selfcheck-only", "generate-schema-only"]),
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

    /// The Azure Blob Storage Account key for files
    #[structopt(
        long,
        env = "FILE_STORAGE_ACCESS_KEY",
        hide_env_values = true,
        required_unless_one(&["selfcheck-only", "generate-schema-only"])
    )]
    pub file_storage_access_key: Option<String>,

    /// The Azure Blob Storage Container URL for file uploads
    #[structopt(
        long,
        env = "UPLOAD_CONTAINER_URL",
        parse(try_from_str = str::parse),
        required_unless_one(&["selfcheck-only", "generate-schema-only"])
    )]
    pub upload_container_url: Option<Url>,

    /// The Azure Blob Storage Container URL for files
    #[structopt(
        long,
        env = "FILES_CONTAINER_URL",
        parse(try_from_str = str::parse),
        required_unless_one(&["selfcheck-only", "generate-schema-only"])
    )]
    pub files_container_url: Option<Url>,
}
