#!/bin/bash

set -exuo pipefail

cd $(dirname $0)

USAGE="

USAGE: $(basename $0) dev-\$FNHSNAME WORKSPACE_TITLE

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

./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Mental Capacity Act"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Resources"
./create-folder-if-needed.sh "$ENVIRONMENT" "$WORKSPACE_TITLE" "Safeguarding Annual Report"
