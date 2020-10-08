use anyhow::Result;
use async_graphql::{ObjectType, QueryBuilder, Schema, SubscriptionType};
use serde_json::Value;
use std::cmp::Ordering;

fn cmp_values(a: &Value, b: &Value) -> Ordering {
    match (a, b) {
        (Value::Null, _) => Ordering::Less,
        (_, Value::Null) => Ordering::Greater,
        (Value::Bool(a), Value::Bool(b)) => a.cmp(&b),
        (Value::Bool(_), _) => Ordering::Less,
        (_, Value::Bool(_)) => Ordering::Greater,
        (Value::Number(a), Value::Number(b)) => a
            .as_f64()
            .partial_cmp(&b.as_f64())
            .unwrap_or(Ordering::Equal),
        (Value::Number(_), _) => Ordering::Less,
        (_, Value::Number(_)) => Ordering::Greater,
        (Value::String(a), Value::String(b)) => a.cmp(&b),
        (Value::String(_), _) => Ordering::Less,
        (_, Value::String(_)) => Ordering::Greater,
        (Value::Array(_), Value::Array(_)) => Ordering::Equal, // TODO
        (Value::Array(_), _) => Ordering::Less,
        (_, Value::Array(_)) => Ordering::Greater,
        (Value::Object(a), Value::Object(b)) => a
            .iter()
            .zip(b)
            .find_map(|(a, b)| match a.0.cmp(&b.0) {
                Ordering::Equal => match cmp_values(a.1, &b.1) {
                    Ordering::Equal => None,
                    res => Some(res),
                },
                res => Some(res),
            })
            .unwrap_or_else(|| a.len().cmp(&b.len())),
    }
}

fn sort_value(v: &mut Value) {
    match *v {
        Value::Array(ref mut arr) => {
            arr.sort_by(cmp_values);
            for v in arr {
                sort_value(v);
            }
        }
        Value::Object(ref mut map) => {
            for (_k, v) in map.iter_mut() {
                sort_value(v);
            }
        }
        _ => {}
    }
}

pub async fn generate_introspection_schema<Query, Mutation, Subscription>(
    schema: &Schema<Query, Mutation, Subscription>,
) -> Result<String>
where
    Query: ObjectType + Send + Sync + 'static,
    Mutation: ObjectType + Send + Sync + 'static,
    Subscription: SubscriptionType + Send + Sync + 'static,
{
    let query = include_str!("./introspection_query.graphql");
    let result = QueryBuilder::new(query)
        .operation_name("IntrospectionQuery")
        .execute(schema)
        .await?;
    let mut data = result.data;

    // Version 1.18.2 of async-graphql seems to order items in the possibleTypes array randomly. In
    // order to create a deterministic schema, where we can easily verify if it's up-to-date, we
    // need to sort arrays in the schema manually.
    // In the latest alpha (2.0.0-alpha.23) this problem doesn't exist anymore. Please remove this
    // code when you update the async-graphql library.
    sort_value(&mut data);

    Ok(format!("{:#}", data))
}

#[cfg(test)]
mod tests {
    use super::sort_value;
    use serde_json::json;

    #[test]
    fn sort_value_sorts_nested_arrays() {
        let a = json!({
            "possibleTypes": [
                {
                    "kind": "OBJECT",
                    "name": "Folder",
                    "ofType": null
                },
                {
                    "kind": "OBJECT",
                    "name": "Workspace",
                    "ofType": null
                }
            ]
        });
        let mut b = json!({
            "possibleTypes": [
                {
                    "kind": "OBJECT",
                    "name": "Workspace",
                    "ofType": null
                },
                {
                    "kind": "OBJECT",
                    "name": "Folder",
                    "ofType": null
                }
            ]
        });
        sort_value(&mut b);
        assert_eq!(a, b);
    }
}
