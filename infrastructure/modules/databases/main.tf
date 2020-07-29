
data "azurerm_postgresql_server" "postgresql_server" {
  name                = "postgresql-${var.environment}"
  resource_group_name = "platform-${var.environment}"
}

provider "postgresql" {
  host = "${
    data.azurerm_postgresql_server.postgresql_server.name
  }.postgres.database.azure.com"
  port              = 5432
  database          = "postgres"
  database_username = data.azurerm_postgresql_server.postgresql_server.administrator_login
  username          = "${data.azurerm_postgresql_server.postgresql_server.administrator_login}@${data.azurerm_postgresql_server.postgresql_server.name}"
  password          = var.postgresql_admin_password
  sslmode           = "require"
  connect_timeout   = 15
  superuser         = false
}

data "azurerm_kubernetes_cluster" "cluster" {
  name                = var.environment
  resource_group_name = "platform-${var.environment}"
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



resource "random_password" "kratos_postgresql_password" {
  length  = 50
  special = false
  upper   = true
}

resource "postgresql_role" "kratos_user" {
  name     = "kratos_user"
  login    = true
  password = random_password.kratos_postgresql_password.result
}

# we are using the postgresql provider here because azurerm_postgresql_database
# doesn't let us set the owner to a role other than the server admin.
resource "postgresql_database" "kratos_db" {
  name              = "kratos_db"
  owner             = "kratos_user"
  lc_collate        = "C"
  connection_limit  = -1
  allow_connections = true
}

resource "kubernetes_namespace" "kratos" {
  metadata {
    name = "kratos"
    annotations = {
      "linkerd.io/inject" = "enabled"
    }
  }
}
resource "kubernetes_secret" "kratos_db_creds" {
  metadata {
    name      = "kratos-db-creds"
    namespace = "kratos"
  }
  data = {
    # TODO: make a user that's not the db server admin, and use that here instead
    # username = data.azurerm_postgresql_server.postgresql_server.administrator_login
    # password = var.postgresql_admin_password
    dsn = "postgres://${
      postgresql_role.kratos_user.name
      }@${
      data.azurerm_postgresql_server.postgresql_server.name
      }:${
      random_password.kratos_postgresql_password.result
      }@${
      data.azurerm_postgresql_server.postgresql_server.name
      }.postgres.database.azure.com:5432/${
      postgresql_database.kratos_db.name
    }"
  }
}