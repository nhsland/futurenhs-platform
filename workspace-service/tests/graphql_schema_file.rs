#[async_std::test]
async fn graphql_schema_file() {
    let current = include_str!("../graphql-schema.json").trim_end();
    let actual = workspace_service::generate_graphql_schema().await.unwrap();
    assert_eq!(current, actual);
}
