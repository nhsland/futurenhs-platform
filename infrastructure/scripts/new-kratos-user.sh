#!/bin/bash

set -euxo pipefail

EMAIL="${1:?"Please specify your email as the first parameter, e.g. jane.doe@red-badger.com"}"

TEMPLATE='{
  "traits": {
    "email": "EMAIL"
  }
}'

curl --header "Content-Type: application/json" \
	--request POST \
	--data "$(echo $TEMPLATE | sed s/EMAIL/$EMAIL/g)" \
	http://kratos-admin.kratos/identities
