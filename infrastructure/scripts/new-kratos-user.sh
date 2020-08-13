#!/bin/bash

set -euo pipefail

ENVIRONMENT="${1:?"Please specify your environment name as the first parameter, e.g. dev-jane"}"
EMAIL="${2:?"Please specify your email as the first parameter, e.g. jane.doe@red-badger.com"}"

CURRENT_CONTEXT=$(kubectl config current-context)
if [ "$ENVIRONMENT" != "$CURRENT_CONTEXT" ]; then
	echo "You want to deploy to:   $ENVIRONMENT"
	echo "Your current content is: $CURRENT_CONTEXT"
	echo "Please change your current context (e.g. using 'kubectl config use-context' or a combination or 'az account set' and 'az aks get-credentials') and try again"
	exit 1
fi

if ! curl http://kratos-admin.kratos --silent --output /dev/null; then
	echo "Please run"
	echo "    sudo kubefwd services --exitonfailure -n kratos"
	echo "in another tab, to give this script access to your cluster."
	exit 1
fi

CREATE_USER_BODY=$(
	jq \
		--null-input \
		--arg email "$EMAIL" \
		'{
			"traits": {
				"email": $email
			}
		}'
)

CREATE_USER_RESPONSE=$(
	curl --silent \
		--header "Content-Type: application/json" \
		--request POST \
		--data "$CREATE_USER_BODY" \
		http://kratos-admin.kratos/identities
)

IDENTITY_ID=$(echo "$CREATE_USER_RESPONSE" | jq -r .id)

if [ -z "$IDENTITY_ID" ]; then
	echo "Something went wrong creating a user."
	echo "$CREATE_USER_RESPONSE" | jq
	echo "Please try again with a different email address, or go through the password reset flow yourself, at:"
	echo "    http://localhost:4455/auth/recovery"
	echo "or"
	echo "    https://fnhs-$ENVIRONMENT.westeurope.cloudapp.azure.com/auth/recovery"
	exit 1
fi

TRIGGER_PASSWORD_RESET_BODY=$(
	jq \
		--null-input \
		--arg identity_id "$IDENTITY_ID" \
		'{
			"expires_in": "12h",
			"identity_id": $identity_id
		}'
)

LINK=$(
	curl --request POST -sL \
		--header "Content-Type: application/json" \
		--request POST \
		--data "$TRIGGER_PASSWORD_RESET_BODY" \
		http://kratos-admin.kratos/recovery/link |
		jq -r .recovery_link
)

echo "SUCCESS: $EMAIL was created with user-id $IDENTITY_ID"
echo "To set a password, go to:"
echo "    http://localhost:4455$LINK"
echo "or"
echo "    https://fnhs-$ENVIRONMENT.westeurope.cloudapp.azure.com$LINK"
