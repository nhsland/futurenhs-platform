#!/bin/bash
set -eu

CURRENT_CLUSTER=$(kubectl config current-context)

while true; do
    read -p "The current cluster is $CURRENT_CLUSTER. Are you sure you would like to add Bitnami Sealed Secrets to this cluster? (y/n)" yn
    case $yn in
        [Yy]* )
            echo "Installing Bitnami Sealed Secrets controller into Cluster"
            kubectl apply -f ../kubernetes/sealed-secrets/controller.yaml || { echo 'Unable to apply to cluster.' ; exit 1; }
            
        break;;
        [Nn]* ) echo "You may wish to use the commands 'az account set' and 'az aks get-credentials' to change cluster."; exit;;
        * ) echo "Please answer 'yes' or 'no'.";;
    esac
done
