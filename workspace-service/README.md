# Workspace Service

The API is built with [Rust](https://www.rust-lang.org/), using a web server crate called [tide](https://github.com/http-rs/tide).

## How to use

1. Install the Rust toolchain
1. Install the [SQLx CLI](https://github.com/launchbadge/sqlx/tree/master/sqlx-cli). We use it to run DB migrations and create a cached version of the type-checked SQL queries using the `prepare` command.
1. Run the tests to make sure everything is set up correctly: `cargo test`
1. Start Docker for Desktop
1. Run locally: `make run-local`

After you changed the database schema:

- Run `make prepare` to update sqlx-data.json

After you changed the GraphQL schema:

- Run `make graphql-schema.json` to update graphql-schema.json

## Migrations

To add a new database migration:

1. Run `sqlx migrate add <NAME>`, which will create a new file in the [migrations](./migrations) folder.
1. Edit the file and write your migration.
1. Run `make prepare` to update the sqlx-data.json file.

## Formatting

[rustfmt](https://github.com/rust-lang/rustfmt) is used for formatting our rust code. CI will fail if code is not formatted correctly.

To run locally: `cargo fmt`

## IDE Support

Most of the team uses Visual Studio Code with the [rust-analyser](https://marketplace.visualstudio.com/items?itemName=matklad.rust-analyzer) plugin.

The default formatter for .sql files in VS Code is not PostgreSQL-specific and highlights many words that are not keywords in PostgreSQL. It is worthwhile using some PostgreSQL-specific syntax highlighting to avoid confusion (for example, you could install a plugin like [this one](https://marketplace.visualstudio.com/items?itemName=JPTarquino.postgresql) and run `Cmd+Shift+P`, `Change Language Mode`, `Configure File Association for '.sql'...`, `PGSQL`).
