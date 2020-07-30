#!/bin/bash

# This is a delicious hack because BrowserStack doesn't let us specify a config file

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"

CONFIG_FILE="${1:?"Please enter a cypress-*.json OR your name"}"

if [[ "$CONFIG_FILE" == *.json ]]; then
	cp $CONFIG_FILE $REPO_ROOT/test/cypress.json
else
	echo "making dev config file"
	NAME=$CONFIG_FILE
	$REPO_ROOT/test/scripts/make-dev-config.sh $NAME
fi

cd $REPO_ROOT/test && yarn browserstack-cypress run
rm $REPO_ROOT/test/cypress.json
