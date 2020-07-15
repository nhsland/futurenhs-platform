#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"

setup_terraform() {
    DEV_CONFIG_FILE="$REPO_ROOT/infrastructure/environments/setup-dev-shared/terraform.tfvars"
    
    SUBSCRIPTION_ID=4a4be66c-9000-4906-8253-6a73f09f418d
    RESOURCE_GROUP_NAME=vault
    STORAGE_ACCOUNT_NAME=fnhstfstatedevshared
    CONTAINER_NAME=vault-container
    
    if [ -f "$DEV_CONFIG_FILE" ]; then
        echo "File infrastructure/environments/setup-dev-shared/terraform.tfvars already exists."
        echo "If you want to initialize your environment again, please delete the file and rerun this script."
        exit 1
    fi
    
    # Use non-production subscription
    az account set --subscription $SUBSCRIPTION_ID
    
    # Create resource group
    # TODO: do we want to limit this to england/wales, or is europe okay?
    az group create \
    --name $RESOURCE_GROUP_NAME \
    --location westeurope \
    --output none
    
    # Create storage account
    az storage account create \
    --kind StorageV2 \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME \
    --sku Standard_LRS \
    --encryption-services blob \
    --output none
    
    # Get storage account key
    ACCESS_KEY=$(az storage account keys list \
        --resource-group $RESOURCE_GROUP_NAME \
        --account-name $STORAGE_ACCOUNT_NAME \
        --query [0].value \
    --output tsv)
    
    # Create blob container
    az storage container create \
    --name $CONTAINER_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --account-key "$ACCESS_KEY" \
    --output none
    
    
		cat >"$DEV_CONFIG_FILE" <<EOF
resource_group_name="$RESOURCE_GROUP_NAME"
storage_account_name="$STORAGE_ACCOUNT_NAME"
EOF
    
    (cd $REPO_ROOT/infrastructure/environments/setup-dev-shared && terraform init -backend-config=terraform.tfvars)
    
    echo "The shared development terraform environment is ready to go"
}

setup_terraform
