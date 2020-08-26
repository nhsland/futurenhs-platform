#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"
USERNAME=$(kubectl get secret frontend -o json --namespace frontend | jq '.data.postgresUsername | @base64d')
USERNAME="${USERNAME:1:${#USERNAME}-2}"
PASSWORD=$(kubectl get secret frontend -o json --namespace frontend | jq '.data.postgresPassword | @base64d')
PASSWORD="${PASSWORD:1:${#PASSWORD}-2}"

psql "host=postgresql-dev-potts.postgres.database.azure.com port=5432 dbname=session user=$USERNAME password=$PASSWORD sslmode=require" < "table-schema.sql"
