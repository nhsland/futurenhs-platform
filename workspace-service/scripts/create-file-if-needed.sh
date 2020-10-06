#!/bin/bash

set -euo pipefail

cd $(dirname $0)

USAGE="

USAGE: $(basename $0) dev-\$FNHSNAME WORKSPACE_TITLE FOLDER_TITLE FILE_NAME

"

ENVIRONMENT="${1:?"${USAGE}Please specify your environment name as the first parameter, e.g. dev-jane"}"
WORKSPACE_TITLE=${2:?"${USAGE}Please give workspace title as second parameter."}
FOLDER_TITLE=${3:?"${USAGE}Please give folder title as third parameter."}
FILE_NAME=${4:?"${USAGE}Please provide a file name, e.g. data-file.xlsx."}

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
folder=$(./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "$FOLDER_TITLE")

if [ $folder = "null" ]; then
	echo "Something went wrong finding/creating your folder"
	exit 1
fi

body=$(
	jq \
		--null-input \
		--arg folder "$folder" \
		'{
		"query": "query FilesByFolder($folder: ID!) { filesByFolder(folder: $folder) { title, id } }",
		"variables": {
			"folder": $folder,
		}
	}'
)
existing_files=$(
	curl \
		--silent \
		--show-error \
		-XPOST \
		$WORKSPACE_SERVICE_GRAPHQL_ENDPOINT \
		-H 'Content-Type: application/json' \
		-d "$body"
)

found=$(
	echo "$existing_files" |
		jq \
			-r \
			--arg title "$FOLDER_TITLE" \
			'.data.filesByFolder | map(select(.title == $title))[0].id'
)
if [ "$found" != "null" ]; then
	echo $found
	exit 0
fi

FILE_TYPE=$(echo $FILE_NAME | sed -e 's/^.*[.]//' -e s/png/img/)
FILE_TITLE=$(echo $FILE_NAME | sed -e 's/[.][^.]*$//')

body=$(
	jq \
		--null-input \
		--arg folder "$folder" \
		--arg title "$FILE_TITLE" \
		--arg description "$FILE_NAME" \
		--arg folder "$FILE_NAME" \
		--arg fileName "$FILE_NAME" \
		--arg fileType "$FILE_TYPE" \
		--arg blobStoragePath "$FILE_NAME" \
		'{
			"query": "mutation CreateFile($title: String!, $description: String!, $folder: String!, $fileName: String!, $fileType: String!, $blobStoragePath: String!) { createFile(newFile: { title: $title,  description: $description, folder: $folder, fileName: $fileName, fileType: $fileType, blobStoragePath: $blobStoragePath }) { id } }",
			"variables": {
				"folder": $folder,
				"title": $title,
				"description": $description,
                "folder": $folder,
                "fileName": $fileName,
                "fileType": $fileType,
                "blobStoragePath": $blobStoragePath,
			}
		}'
)
response=$(
	curl \
		--silent \
		--show-error \
		-XPOST \
		$WORKSPACE_SERVICE_GRAPHQL_ENDPOINT \
		-H 'Content-Type: application/json' \
		-d "$body"
)
id=$(echo "$response" | jq -r '.data.createFile.id')
if [ $id = "null" ]; then
	echo "something went wrong! $response"
	exit 1
fi

echo $id
