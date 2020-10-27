# Workspace Service

## How to use

The API is built with [Rust](https://www.rust-lang.org/), using a web server crate called [tide](https://github.com/http-rs/tide), and the source code can be seen in [./src/main.rs](./src/main.rs).

1. Install the rust toolchain (see https://www.rust-lang.org/learn/get-started)
1. Install the [SQLx CLI](https://github.com/launchbadge/sqlx/tree/master/sqlx-cli) so that you use database in local development (e.g. run migrations, `prepare` when you change the schema)
1. Run the tests to make sure everything is set up correctly: `cargo test`
1. Start Docker for Desktop
1. Run locally: `make run-local`
1. Build a Docker image `make docker-build` (requires Linux machine)
1. Run docker image `make docker-run`

After you changed the database schema:

- Run `make prepare` to update sqlx-data.json

After you changed the GraphQL schema:

- Run `make graphql-schema.json` to update graphql-schema.json

## Migrations

1. `sqlx migrate add <NAME>`
1. Write migration
1. `make prepare`

## Formatting

[rustfmt](https://github.com/rust-lang/rustfmt) is used for formatting our rust code. CI will fail if code is not formatted correctly.

To run locally: `cargo fmt`

## IDE Support

Most of the team uses Visual Studio Code with the [rust-analyser](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) plugin.

The default formatter for .sql files in vscode is not postgresql-specific, and highlights many words that are not keywords in postgresql. It is worthwhile using some postgresql-specific syntax highlighting to avoid confusion (for example, you could install a plugin like [this one](https://marketplace.visualstudio.com/items?itemName=JPTarquino.postgresql) and run `cmd+shift+p` `Change Language Mode` `Configure File Association for '.sql'...` `PGSQL`).
