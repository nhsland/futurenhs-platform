#!/bin/bash
set -eu

# https://stackoverflow.com/a/1482133
cd $(dirname "$0")
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd $REPO_ROOT

ENVIRONMENT="${1:?"Please specify you environment name as the first parameter, e.g. dev-jane"}"
CURRENT_CONTEXT=$(kubectl config current-context)

if [ "$ENVIRONMENT" = "production" ]; then
    echo "This script hasn't been tested with production yet. Please do this by hand."
	exit 1
fi

if [ "$ENVIRONMENT" != "$CURRENT_CONTEXT" ]; then
	echo "You want to deploy to:   $ENVIRONMENT"
	echo "Your current content is: $CURRENT_CONTEXT"
	echo "Please change your current context (e.g. using 'kubectl config use-context' or a combination or 'az account set' and 'az aks get-credentials') and try again"
	exit 1
fi

# TODO: this is slow. Might be possible to do a fetch first and only run the update if the acr is not there?
az aks update \
   -n $ENVIRONMENT \
   -g platform-$ENVIRONMENT \
   --attach-acr "/subscriptions/75173371-c161-447a-9731-f042213a19da/resourceGroups/platform-production/providers/Microsoft.ContainerRegistry/registries/fnhsproduction"


az keyvault secret show --vault-name "fnhs-shared-dev" --name "sealed-secret-yaml" \
  | jq -r '.value' \
  | kubectl apply -f -

kubectl apply -f ./infrastructure/kubernetes/sealed-secrets/controller.yaml


./infrastructure/scripts/install-linkerd.sh $ENVIRONMENT

./infrastructure/scripts/install-argo-cd.sh $ENVIRONMENT

echo ""
echo ""
echo "Things to check:"
echo " * This output should be about 5 lines long and shouldn't say"
echo "   anything about generating a new private key:"
kubectl -n kube-system logs -l name=sealed-secrets-controller