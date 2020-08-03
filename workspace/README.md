# Workspace Service

## To get going

The API is built with [Rust](https://www.rust-lang.org/), using a web server crate called [tide](https://github.com/http-rs/tide), and the source code can be seen in [./src/main.rs](./src/main.rs).

1. Install the rust toolchain (see https://www.rust-lang.org/learn/get-started)
1. Run the tests to make sure everything is set up correctly: `cargo test`
1. Run locally: `cargo run`
1. Build a Docker image `make docker-build`
1. Run docker image `make docker-run`

## Formatting

[rustfmt](https://github.com/rust-lang/rustfmt) is used for formatting our rust code. CI will fail if code is not formatted correctly.

To run locally: `cargo fmt`
