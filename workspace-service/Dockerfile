FROM debian:buster-slim

RUN apt-get update && apt-get install -y \
    tini \
    libssl1.1 \
    libcurl4 \
    ;

RUN useradd svc

COPY target/release/workspace_service /

# Test if the binary is executable in this environment. This ensures it's built
# for the correct architecture and all shared libraries are available.
# --selfcheck_only means the binary will immediately exit.
RUN /workspace_service --selfcheck_only

RUN chown -R svc /workspace_service

USER svc

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/workspace_service"]
