#!/bin/bash

set -eu

BROWSERSTACK_ACCESS_KEY=$(grep BROWSERSTACK_ACCESS_KEY .env | xargs)
BROWSERSTACK_ACCESS_KEY=${BROWSERSTACK_ACCESS_KEY#*=}

/usr/local/bin/BrowserStackLocal --key $BROWSERSTACK_ACCESS_KEY

# --local-identifier bslocal1
