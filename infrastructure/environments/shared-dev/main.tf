terraform {
  required_version = "0.13.3"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.14.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "2.1"
    }
  }
  backend "azurerm" {
    container_name       = "tfstate"
    key                  = "devshared.terraform.tfstate"
    resource_group_name  = "tfstatedevshared"
    storage_account_name = "fnhstfstatedevshared"
  }
}

provider "azurerm" {
  features {}
  subscription_id = "4a4be66c-9000-4906-8253-6a73f09f418d"
}

provider "tls" {}

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "shared" {
  name     = "shared-dev"
  location = var.location

  tags = {
    environment = "dev-shared"
  }
}
