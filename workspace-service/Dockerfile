# Setup rust build environment
FROM rust:1.44.1 AS build-context

RUN rustup component add rustfmt clippy

WORKDIR /usr/src/workspace-service

COPY Cargo.toml .
COPY Cargo.lock .

# IP Address tells docker to talk to host
ARG DATABASE_URL=postgres://postgres:postgres@172.17.0.1:5432
ENV DATABASE_URL=$DATABASE_URL

# Layer hack: Build an empty program to compile dependencies and place on their own layer.
# This cuts down build time

# it was borrowed from here:
# https://github.com/deislabs/krustlet/blob/master/Dockerfile#L7
RUN mkdir -p ./src/ && echo 'fn main() {}' >./src/main.rs && echo '' >./src/lib.rs

RUN cargo fetch

RUN cargo build --release && rm -rf ./target/release/.fingerprint/workspace_service-*

# Setup debian release environment
FROM debian:buster-slim AS release-context

RUN apt-get update && apt-get install -y \
    tini \
    ;

RUN apt install libssl1.1 -y

RUN useradd svc

# Build real binaries now, as late as possible
FROM build-context AS build

COPY ./src ./src
COPY sql ./sql
COPY ./migrations ./migrations

RUN cargo clippy --release -- -D warnings && cargo test --release && cargo build --release

# Create the release
FROM release-context AS release

COPY --from=build /usr/src/workspace-service/target/release/workspace_service /

RUN chown -R svc /workspace_service

USER svc

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/workspace_service"]
