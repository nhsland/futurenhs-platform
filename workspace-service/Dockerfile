FROM debian:buster-slim

RUN apt-get update && apt-get install -y \
    tini \
    libssl1.1 \
    ;

RUN useradd svc

COPY target/release/workspace_service /

# Test if the binary is executable in this environment. This ensures it's built
# for the correct architecture and all shared libraries are available.
# SELFCHECK_ONLY=1 means the binary will immediately exit.
RUN SELFCHECK_ONLY=1 /workspace_service

RUN chown -R svc /workspace_service

USER svc

ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/workspace_service"]
