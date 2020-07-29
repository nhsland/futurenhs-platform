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
