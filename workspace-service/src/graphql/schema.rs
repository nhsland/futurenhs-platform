use anyhow::Result;
use async_graphql::{ObjectType, Request, Schema, SubscriptionType};

pub async fn generate_introspection_schema<Query, Mutation, Subscription>(
    schema: &Schema<Query, Mutation, Subscription>,
) -> Result<String>
where
    Query: ObjectType + Send + Sync + 'static,
    Mutation: ObjectType + Send + Sync + 'static,
    Subscription: SubscriptionType + Send + Sync + 'static,
{
    let query = include_str!("./introspection_query.graphql");
    let req = Request::new(query);
    let res = schema.execute(req).await;
    Ok(serde_json::to_string_pretty(&res.data)?)
}
