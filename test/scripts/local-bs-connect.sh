#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd $REPO_ROOT/test

BROWSERSTACK_ACCESS_KEY=$(grep BROWSERSTACK_ACCESS_KEY .env | xargs)
BROWSERSTACK_ACCESS_KEY=${BROWSERSTACK_ACCESS_KEY#*=}

/usr/local/bin/BrowserStackLocal --key $BROWSERSTACK_ACCESS_KEY

# --local-identifier bslocal1
