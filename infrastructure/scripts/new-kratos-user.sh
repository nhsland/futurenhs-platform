#!/bin/bash

set -euxo pipefail

EMAIL="${1:?"Please specify your email as the first parameter, e.g. jane.doe@red-badger.com"}"

BODY=$(
	jq \
		--null-input \
		--arg email "$EMAIL" \
		'{
			traits: {
				email: $email
			}
		}'
)

curl --header "Content-Type: application/json" \
	--request POST \
	--data "$BODY" \
	http://kratos-admin.kratos/identities |
	jq
