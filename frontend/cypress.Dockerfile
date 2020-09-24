# syntax = docker/dockerfile:experimental
FROM cypress/browsers:node13.8.0-chrome81-ff75

WORKDIR /root

ENTRYPOINT ["/sbin/tini", "--"]

COPY package.json .
COPY yarn.lock .

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn/v1 \
    yarn config set no-progress && \
    yarn

COPY . .

ENV GRAPHQL_API_ROOT=http://localhost:3001/graphql

# Required to prevent Firefox hanging
ENV MOZ_FORCE_DISABLE_E10S=1

# Firefox is not running reliably within Buildkite.
# This should be addressed following a Cypress update.
# 
# RUN yarn cy:ci:firefox
RUN yarn cy:ci:chrome
