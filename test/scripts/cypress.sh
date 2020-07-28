#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"

NAME="${1:?"Please enter your name as first argument"}"

$REPO_ROOT/test/scripts/make-dev-config.sh $NAME

cd $REPO_ROOT/test && yarn cypress open
rm $REPO_ROOT/test/cypress.json
