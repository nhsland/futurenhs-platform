#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"

setup_terraform() {
    SUBSCRIPTION_ID=4a4be66c-9000-4906-8253-6a73f09f418d
    RESOURCE_GROUP_NAME=vault
    STORAGE_ACCOUNT_NAME=fnhstfstatedevshared
    CONTAINER_NAME=vault-container
    
    # Use non-production subscription
    az account set --subscription $SUBSCRIPTION_ID
    
    az group create \
    --name $RESOURCE_GROUP_NAME \
    --location westeurope \
    --output none
    
    az storage account create \
    --kind StorageV2 \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \gs
    --sku Standard_LRS \
    --encryption-services blob \
    --output none
    
    ACCESS_KEY=$(
        az storage account keys list \
        --resource-group $RESOURCE_GROUP_NAME \
        --account-name $STORAGE_ACCOUNT_NAME \
        --query [0].value \
        --output tsv
    )
    
    az storage container create \
    --name $CONTAINER_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --account-key "$ACCESS_KEY" \
    --output none
    
    (cd $REPO_ROOT/infrastructure/environments/shared-dev && terraform init -backend-config="resource_group_name=vault"  -backend-config="storage_account_name=fnhstfstatedevshared")
    
    echo "The shared development terraform environment is ready to go"
}

setup_terraform
