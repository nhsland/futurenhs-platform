FROM debian:buster-slim

RUN apt-get update && apt-get install -y \
    tini \
    libssl1.1 \
    libcurl4 \
    ;

RUN useradd svc

COPY target/release/workspace_service /

RUN chown -R svc /workspace_service

USER svc

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/workspace_service"]
