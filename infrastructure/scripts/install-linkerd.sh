#!/bin/bash
set -eu

ENVIRONMENT="${1:?"Please specify you environment name as the first parameter, e.g. dev-jane"}"
CURRENT_CONTEXT=$(kubectl config current-context)

if [ "$ENVIRONMENT" != "$CURRENT_CONTEXT" ]; then
	echo "You want to deploy to:   $ENVIRONMENT"
	echo "Your current content is: $CURRENT_CONTEXT"
	echo "Please change your current context (e.g. using 'kubectl config use-context' or a combination or 'az account set' and 'az aks get-credentials') and try again"
	exit 1
fi

echo "Installing Linkerd CLI"
brew install linkerd || {
	echo "Unable to install."
	exit 1
}

echo "Checking if linkerd is already set up"
linkerd check && {
	echo 'Looks like linkerd is already installed. Skipping.'
	exit 0
}

echo "Verifying cluster"
linkerd check --pre || {
	echo 'Cluster validation failed. Please fix issues before proceeding. Perhaps you already have Linkerd installed?'
	exit 1
}

echo "Installing Linkerd"
linkerd install --ha | kubectl apply -f - || {
	echo 'Unable to apply to cluster.'
	exit 1
}
linkerd check
