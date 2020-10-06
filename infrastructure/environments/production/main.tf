terraform {
  required_version = "0.13.4"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.14.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "1.12.0"
    }
    postgresql = {
      source  = "terraform-providers/postgresql"
      version = "1.7.1"
    }
    random = {
      source  = "hashicorp/random"
      version = "2.2"
    }
  }
  backend "azurerm" {
    container_name       = "tfstate"
    key                  = "production.terraform.tfstate"
    resource_group_name  = "tfstate"
    storage_account_name = "fnhstfstateproduction"
  }
}

provider "azurerm" {
  features {}
  subscription_id = "75173371-c161-447a-9731-f042213a19da"
}

provider "random" {}

# This module should be applied first, using `terraform apply -target module.platform`
# so that the kubernetes cluster and postresql firewall rules are set up.
# These are needed before the `kubernetes` and `postgresql` terraform providers can plan
# anything.
module platform {
  source                    = "../../modules/platform"
  environment               = "production"
  location                  = var.location
  ip_whitelist_postgresql   = var.ip_whitelist_postgresql
  ip_whitelist_analytics    = var.ip_whitelist_analytics
  enable_analytics          = true
  ad_username               = "FutureNHS Developers"
  ad_object_id              = "b06ebd00-f52c-4e82-ac88-0520f4320fee"
  kubernetes_min_node_count = 2
}

resource "azurerm_container_registry" "acr" {
  name                = "fnhsproduction"
  resource_group_name = module.platform.resource_group_name
  location            = var.location
  sku                 = "Basic"
}

resource "azurerm_role_assignment" "acrpull_cluster" {
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "AcrPull"
  principal_id                     = module.platform.cluster_identity_principal_id
  skip_service_principal_aad_check = true
}

provider "kubernetes" {
  load_config_file       = "false"
  host                   = module.platform.kube_config.0.host
  username               = module.platform.kube_config.0.username
  password               = module.platform.kube_config.0.password
  client_certificate     = base64decode(module.platform.kube_config.0.client_certificate)
  client_key             = base64decode(module.platform.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(module.platform.kube_config.0.cluster_ca_certificate)
}

provider "postgresql" {
  host              = "${module.platform.postgresql_server_name}.postgres.database.azure.com"
  port              = 5432
  database          = "postgres"
  database_username = module.platform.postgresql_admin
  username          = "${module.platform.postgresql_admin}@${module.platform.postgresql_server_name}"
  password          = module.platform.postgresql_admin_password
  sslmode           = "require"
  connect_timeout   = 15
  superuser         = false
}

module databases {
  source                   = "../../modules/databases"
  environment              = "production"
  postgresql_server_name   = module.platform.postgresql_server_name
  eventgrid_topic_endpoint = module.platform.eventgrid_topic_endpoint
  eventgrid_topic_key      = module.platform.eventgrid_topic_key
  instrumentation_key      = module.platform.instrumentation_key
}

module storage {
  source              = "../../modules/storage"
  environment         = "production"
  location            = var.location
  resource_group_name = module.platform.resource_group_name
}
