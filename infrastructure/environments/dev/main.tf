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

# TODO: Stop doing this, and take the things we need from the output of module.platform instead.
data "azurerm_kubernetes_cluster" "cluster" {
  name                = "dev-${var.USERNAME}"
  resource_group_name = "platform-dev-${var.USERNAME}"
}

# see https://www.terraform.io/docs/providers/azurerm/r/kubernetes_cluster.html
provider "kubernetes" {
  load_config_file       = "false"
  host                   = data.azurerm_kubernetes_cluster.cluster.kube_config.0.host
  username               = data.azurerm_kubernetes_cluster.cluster.kube_config.0.username
  password               = data.azurerm_kubernetes_cluster.cluster.kube_config.0.password
  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate)
}

data "azurerm_postgresql_server" "postgresql_server" {
  name                = "postgresql-dev-${var.USERNAME}"
  resource_group_name = "platform-dev-${var.USERNAME}"
}

provider "postgresql" {
  host = "${
    data.azurerm_postgresql_server.postgresql_server.name
  }.postgres.database.azure.com"
  port              = 5432
  database          = "postgres"
  database_username = data.azurerm_postgresql_server.postgresql_server.administrator_login
  username          = "${data.azurerm_postgresql_server.postgresql_server.administrator_login}@${data.azurerm_postgresql_server.postgresql_server.name}"
  password          = module.platform.postgresql_admin_password
  sslmode           = "require"
  connect_timeout   = 15
  superuser         = false
}

module databases {
  source                    = "../../modules/databases"
  environment               = "dev-${var.USERNAME}"
  postgresql_admin_password = module.platform.postgresql_admin_password
  postgresql_server_name = data.azurerm_postgresql_server.postgresql_server.name
}
