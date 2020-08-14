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

FNHSNAME=$(echo $ENVIRONMENT | sed s/dev-//)

if [ "$ENVIRONMENT" != "dev-$FNHSNAME" ]; then
	echo "environment should be of the form 'dev-*' where * is your name."
	exit 1
fi

echo "Don't run away quite yet. Terraform will ask you to type 'yes' a couple of times."

OVERWRITE=localfiles $REPO_ROOT/infrastructure/scripts/create-dev-environment.sh $FNHSNAME

# These are the steps printed out by create-dev-environment.sh
(
	cd $REPO_ROOT/infrastructure/environments/dev &&
		terraform apply -target module.platform &&
		terraform apply
)

az aks get-credentials --overwrite-existing --resource-group platform-dev-$FNHSNAME --name dev-$FNHSNAME

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

az keyvault secret show --vault-name "fnhs-shared-dev" --name "sealed-secret-yaml" |
	jq -r '.value' |
	kubectl apply -f -

kubectl apply -f ./infrastructure/kubernetes/sealed-secrets/controller.yaml
kubectl rollout status --timeout=1m --watch=true -n kube-system deployments/sealed-secrets-controller
if [ "$(kubeseal --fetch-cert | shasum)" != "22910de9ae71989b2048923c38a886ae2dca8e80  -" ]; then
	echo "Your cluster seems to be using a different certificate from what we were expecting."
	kubectl -n kube-system logs -l name=sealed-secrets-controller
	echo " ^ This output should be about 5 lines long and shouldn't say"
	echo "   anything about generating a new private key. Can you spot anything wrong?"
	exit 1
fi

./infrastructure/scripts/install-linkerd.sh $ENVIRONMENT

./infrastructure/scripts/install-argo-cd.sh $ENVIRONMENT

echo "Waiting for argocd apps to deploy"

if ! argocd app wait --timeout 300 $(argocd app list -o name); then
	echo "That's taking quite a long time. Let me kick over the ingress controller and see if that helps."
	kubectl -n ingress rollout restart deployment/ingress-nginx-controller
fi

echo ""
echo "Looks like everything deployed okay. Your cluster should be available at "
echo "https://fnhs-$ENVIRONMENT.westeurope.cloudapp.azure.com/"
echo ""
