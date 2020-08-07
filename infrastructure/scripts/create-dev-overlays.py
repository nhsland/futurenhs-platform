#!/usr/bin/env python3

import json
import os
from string import Template
import argparse

repo_root = os.path.join(os.path.dirname(__file__), '../..')
services = [
    'frontend/manifests',
    'hello-world/manifests',
    'workspace-service/manifests',
    'infrastructure/kubernetes/argocd/apps',
    'infrastructure/kubernetes/cert-manager',
    'infrastructure/kubernetes/ingress',
    'infrastructure/kubernetes/kratos',
]

def create_overlays(name, variables):
    for service in  services:
        os.makedirs(f'{repo_root}/{service}/dev-{name}', exist_ok=True)
        for filename in os.listdir(f'{repo_root}/{service}/dev-template'):
            with open(f'{repo_root}/{service}/dev-template/{filename}') as f:
                content = f.read()
            content = Template(content).substitute(NAME=name, **variables)
            with open(f'{repo_root}/{service}/dev-{name}/{filename}', 'w') as f:
                f.write(content)

def main():
    parser = argparse.ArgumentParser(description="expand dev-template for all developers")
    parser.add_argument(
        '--set-branch',
        dest='branch',
        action="store",
        default=False,
        help=(
            "override BRANCH (useful for running install-argo-cd.sh without committing)"
        ),
    )
    args = parser.parse_args()

    with open(f'{repo_root}/infrastructure/dev-overlay-variables.json') as f:
        overlays = json.load(f)

    for name, variables in overlays.items():
        if name == "__doc__":
            continue
        if args.branch:
            variables['BRANCH'] = args.branch
        create_overlays(name, variables)

if __name__ == '__main__':
    main()
