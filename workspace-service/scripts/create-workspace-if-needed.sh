#!/bin/bash

set -euo pipefail

cd $(dirname $0)

USAGE="

USAGE: $(basename $0) WORKSPACE_TITLE [WORKSPACE_DESCRIPTION]

"
WORKSPACE_TITLE=${1:?"${USAGE}Please give workspace title as first argument."}
WORKSPACE_DESCRIPTION=${2:-"Test workspace for $WORKSPACE_TITLE"}

existing_workspaces=$(
	curl -XPOST \
		http://workspace-service.workspace-service/graphql \
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
if [ -n "$found" ]; then
	echo $found
	exit 0
fi

body=$(
	jq \
		--null-input \
		--arg title "$WORKSPACE_TITLE" \
		--arg description "$WORKSPACE_DESCRIPTION" \
		'{
			"query": "mutation CreateWorkspace($title: String!, $description: String!) { createWorkspace(workspace: { title: $title,  description: $description }) { id } }",
			"variables": {
				"title": $title,
				"description": $description
			}
		}'
)
response=$(
	curl -XPOST \
		http://workspace-service.workspace-service/graphql \
		-H 'Content-Type: application/json' \
		-d "$body"
)
echo "$response" | jq -r '.data.createWorkspace.id'
