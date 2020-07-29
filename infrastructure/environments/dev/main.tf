provider "azurerm" {
  version = "=2.14.0"
  features {}
  subscription_id = "4a4be66c-9000-4906-8253-6a73f09f418d"
}

provider "random" {
  version = "~> 2.2"
}

terraform {
  required_version = "0.12.25"
  backend "azurerm" {
    container_name = "tfstate"
    key            = "dev.terraform.tfstate"
  }
}

# This module should be applied first, using `terraform apply -target module.platform`
# so that the kubernetes cluster and postresql firewall rules are set up.
# These are needed before the `terraform` and `postgresql` terraform providers can plan
# anything.
module platform {
  source                  = "../../modules/platform"
  environment             = "dev-${var.USERNAME}"
  location                = var.location
  ip_whitelist_postgresql = var.ip_whitelist_postgresql
}


module databases {
  source                    = "../../modules/databases"
  environment               = "dev-${var.USERNAME}"
  postgresql_admin_password = module.platform.postgresql_admin_password
}
