#!/bin/bash
set -euo pipefail

NAME="${1:?"Arg 1: name -- e.g. jane"}"
INSTRUMENTATION_KEY="${2:?"Arg 2: instrumentation key -- printed by terraform"}"

create_overlay() {
	FOLDER="$1"
	mkdir -p $FOLDER/dev-$NAME
	for file in $FOLDER/dev-template/*.yaml; do
		filename="$(basename "$file")"
		sed \
			-e "s/{{NAME}}/$NAME/g" \
			-e "s/{{INSTRUMENTATION_KEY}}/$INSTRUMENTATION_KEY/g" \
			$file >"$FOLDER/dev-$NAME/$filename"
	done
}

create_overlay frontend/manifests/
create_overlay hello-world/manifests/
create_overlay infrastructure/kubernetes/argocd/apps/
create_overlay infrastructure/kubernetes/cert-manager/
create_overlay infrastructure/kubernetes/ingress/
