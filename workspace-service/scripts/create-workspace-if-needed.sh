#!/bin/bash

set -euo pipefail

cd $(dirname $0)

USAGE="

USAGE: $(basename $0) dev-\$FNHSNAME WORKSPACE_TITLE [WORKSPACE_DESCRIPTION]

"

ENVIRONMENT="${1:?"${USAGE}Please specify your environment name as the first parameter, e.g. dev-jane"}"
WORKSPACE_TITLE=${2:?"${USAGE}Please give workspace title as second parameter."}
WORKSPACE_DESCRIPTION=${3:-"Test workspace with title $WORKSPACE_TITLE"}

CURRENT_CONTEXT=$(kubectl config current-context)
if [ "$ENVIRONMENT" = "local" ]; then
	WORKSPACE_SERVICE_GRAPHQL_ENDPOINT=http://localhost:3030/graphql
elif [ "$ENVIRONMENT" = "$CURRENT_CONTEXT" ]; then
	WORKSPACE_SERVICE_GRAPHQL_ENDPOINT=http://workspace-service.workspace-service/graphql
else
	echo "You want to populate:    $ENVIRONMENT"
	echo "Your current content is: $CURRENT_CONTEXT"
	echo "Please change your current context using:"
	echo "    kubectl config use-context $ENVIRONMENT"
	echo "or"
	echo "    az account set --subscription \$SUBSCRIPTION_ID && az aks get-credentials --resource-group=platform-$ENVIRONMENT --name=$ENVIRONMENT"
	echo "Once that is done, please run:"
	echo "    kubefwd services -n workspace-service"
	echo "in another tab and try again."
	exit 1
fi

existing_workspaces=$(
	curl \
		--silent \
		--show-error \
		-XPOST \
		$WORKSPACE_SERVICE_GRAPHQL_ENDPOINT \
		-H 'Content-Type: application/json' \
		-d '{"query": "{workspaces { title, id }}"}'
)
found=$(
	echo "$existing_workspaces" |
		jq \
			-r \
			--arg title "$WORKSPACE_TITLE" \
			'.data.workspaces | map(select(.title == $title))[0].id'
)
if [ "$found" != "null" ]; then
	echo $found
	exit 0
fi

body=$(
	jq \
		--null-input \
		--arg title "$WORKSPACE_TITLE" \
		--arg description "$WORKSPACE_DESCRIPTION" \
		'{
			"query": "mutation CreateWorkspace($title: String!, $description: String!) { createWorkspace(newWorkspace: { title: $title,  description: $description }) { id } }",
			"variables": {
				"title": $title,
				"description": $description
			}
		}'
)
response=$(
	curl \
		--silent \
		--show-error \
		-XPOST \
		$WORKSPACE_SERVICE_GRAPHQL_ENDPOINT \
		-H 'x-user-auth-id: feedface-0000-0000-0000-000000000000' \
		-H 'Content-Type: application/json' \
		-d "$body"
)
echo "$response" | jq -r '.data.createWorkspace.id'
