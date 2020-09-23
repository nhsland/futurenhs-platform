use anyhow::{anyhow, Result};
use dotenv::dotenv;
use fnhs_event_models::EventClient;
use opentelemetry::{api::Provider, sdk, sdk::BatchSpanProcessor};
use sqlx::PgPool;
use structopt::StructOpt;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::Registry;
use url::Url;
use workspace_service::sas;

#[derive(Debug, Clone, StructOpt)]
pub struct Config {
    #[structopt(long, env = "SELFCHECK_ONLY")]
    selfcheck_only: bool,

    #[structopt(long, env = "INSTRUMENTATION_KEY")]
    instrumentation_key: Option<String>,

    #[structopt(long, env = "DATABASE_URL")]
    database_url: String,

    #[structopt(
        long,
        env = "EVENTGRID_TOPIC_ENDPOINT",
        parse(try_from_str = str::parse),
    )]
    pub eventgrid_topic_endpoint: Option<Url>,

    #[structopt(long, env = "EVENTGRID_TOPIC_KEY")]
    pub eventgrid_topic_key: Option<String>,

    #[structopt(long, env = "UPLOAD_MASTER_KEY")]
    pub master_key: String,

    #[structopt(
        long,
        env = "UPLOAD_CONTAINER_URL",
        parse(try_from_str = str::parse)
    )]
    container_url: Url,
}

#[async_std::main]
async fn main() -> Result<()> {
    dotenv().ok();
    let config = Config::from_args();

    if config.selfcheck_only {
        println!("SELFCHECK_ONLY is set. Exiting...");
        return Ok(());
    }

    let provider = if let Some(instrumentation_key) = config.instrumentation_key {
        let exporter = opentelemetry_application_insights::Exporter::new(instrumentation_key);
        let batch_exporter = BatchSpanProcessor::builder(
            exporter,
            async_std::task::spawn,
            async_std::stream::interval,
        )
        .build();
        sdk::Provider::builder()
            .with_batch_exporter(batch_exporter)
            .build()
    } else {
        let exporter = opentelemetry::exporter::trace::stdout::Builder::default().init();
        opentelemetry::sdk::Provider::builder()
            .with_simple_exporter(exporter)
            .build()
    };

    let tracer = provider.get_tracer("workspace-service");
    let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);
    let subscriber = Registry::default().with(telemetry);
    tracing::subscriber::set_global_default(subscriber).expect("setting global default failed");

    let connection_pool = PgPool::connect(&config.database_url).await?;
    sqlx::migrate!("./migrations").run(&connection_pool).await?;

    let event_client = if let (Some(topic_endpoint), Some(topic_key)) =
        (config.eventgrid_topic_endpoint, config.eventgrid_topic_key)
    {
        EventClient::new(
            topic_endpoint
                .host_str()
                .ok_or_else(|| anyhow!("EVENTGRID_TOPIC_ENDPOINT does not contain host name"))?
                .to_owned(),
            topic_key,
        )
    } else {
        EventClient::default()
    };

    let app = workspace_service::create_app(
        connection_pool,
        event_client,
        sas::Config::new(config.master_key, config.container_url),
    )
    .await?;
    app.listen("0.0.0.0:3030").await?;

    unreachable!()
}
