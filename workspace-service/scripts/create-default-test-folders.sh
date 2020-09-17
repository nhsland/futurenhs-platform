#!/bin/bash

set -exuo pipefail

cd $(dirname $0)

USAGE="

USAGE: $(basename $0) dev-\$FNHSNAME

"

ENVIRONMENT="${1:?"${USAGE}Please specify your environment name as the first parameter, e.g. dev-jane"}"
WORKSPACE_TITLE="Demo workspace"

CURRENT_CONTEXT=$(kubectl config current-context)
if [ "$ENVIRONMENT" != "$CURRENT_CONTEXT" ]; then
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

./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "FutureNHS Case Study Library"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Getting started"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Platform FAQs"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Support"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Get involved"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Enhance your workspace"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Member stories"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Coronavirus (COVID-19)"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Communications resources"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Administration"

./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Strategic Partners"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Uploads"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Workspace Navigation"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Data"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Information and Analysis"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Evidence"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Community, Networks and Learning"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Workspace Insights"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Good News"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "NHS COVID-19 Data Store"
