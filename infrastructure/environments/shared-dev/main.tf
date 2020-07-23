provider "azurerm" {
  version = "=2.14.0"
  features {}
  subscription_id = "4a4be66c-9000-4906-8253-6a73f09f418d"
}

provider "tls" {
  version = "~> 2.1"
}

terraform {
  required_version = "0.12.25"
  backend "azurerm" {
    container_name       = "vault-container"
    key                  = "dev-vault.terraform.tfstate"
    resource_group_name  = "vault"
    storage_account_name = "fnhstfstatedevshared"
  }
}

data "azurerm_client_config" "current" {
}
