#!/bin/bash

set -euo pipefail

cd $(dirname $0)

USAGE="

USAGE: $(basename $0) WORKSPACE_TITLE FOLDER_TITLE [FOLDER_DESCRIPTION]

"

WORKSPACE_TITLE=${1:?"${USAGE}Please give workspace title as first argument."}
FOLDER_TITLE=${2:?"${USAGE}Please give folder title as second argument."}
FOLDER_DESCRIPTION=${2:-"Test folder for $FOLDER_TITLE"}

workspace=$(./create-workspace-if-needed.sh "$WORKSPACE_TITLE")

if [ $workspace = "" ]; then
	echo "Something went wrong finding/creating your workspace"
	exit 1
fi

body=$(
	jq \
		--null-input \
		--arg workspace "$workspace" \
		'{
      "query": "query FoldersByWorkspace($workspace: ID!) { foldersByWorkspace(workspace: $workspace) { title, id } }",
      "variables": {
        "workspace": $workspace,
      }
    }'
)
existing_folders=$(
	curl -XPOST \
		http://workspace-service.workspace-service/graphql \
		-H 'Content-Type: application/json' \
		-d "$body"
)

found=$(
	echo "$existing_folders" |
		jq \
			-r \
			--arg title "$FOLDER_TITLE" \
			'.data.foldersByWorkspace | map(select(.title == $title))[0].id'
)
if [ "$found" != "" ] && [ "$found" != "null" ]; then
	echo $found
	exit 0
fi

body=$(
	jq \
		--null-input \
		--arg workspace "$workspace" \
		--arg title "$FOLDER_TITLE" \
		--arg description "$FOLDER_DESCRIPTION" \
		'{
			"query": "mutation CreateFolder($workspace: ID!, $title: String!, $description: String!) { createFolder(folder: { workspace: $workspace, title: $title,  description: $description }) { id } }",
			"variables": {
                "workspace": $workspace,
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
echo "$response" | jq -r '.data.createFolder.id'
