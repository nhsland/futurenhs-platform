use anyhow::Result;
use dotenv::dotenv;
use opentelemetry::{api::Provider, sdk, sdk::BatchSpanProcessor};
use std::env;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::Registry;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();
    let instrumentation_key =
        env::var("INSTRUMENTATION_KEY").expect("env var INSTRUMENTATION_KEY should exist");
    let exporter = opentelemetry_application_insights::Exporter::new(instrumentation_key);
    let batch_exporter =
        BatchSpanProcessor::builder(exporter, tokio::spawn, tokio::time::interval).build();
    let provider = sdk::Provider::builder()
        .with_batch_exporter(batch_exporter)
        .build();

    let tracer = provider.get_tracer("workspace-service");
    let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);
    let subscriber = Registry::default().with(telemetry);
    tracing::subscriber::set_global_default(subscriber).expect("setting global default failed");

    let database_url = env::var("DATABASE_URL").expect("API_URL env var not found");

    let app = workspace-service::create_app(&database_url).await?;
    app.listen("0.0.0.0:3030").await?;

    Ok(())
}
