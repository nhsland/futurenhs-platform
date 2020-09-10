use async_std::prelude::FutureExt as _;
use std::time::Duration;

#[async_std::test]
async fn hello_world() {
    let server = async_std::task::spawn(async {
        hello_world::create_app()
            .listen("localhost:8080")
            .await
            .unwrap()
    });

    let client = async_std::task::spawn(async {
        async_std::task::sleep(Duration::from_millis(100)).await;
        let string: String = surf::get("http://localhost:8080/hello/Me")
            .recv_string()
            .await
            .unwrap();
        assert_eq!(string, "Hello, Me\n".to_string());
    });

    server.race(client).await;
}
