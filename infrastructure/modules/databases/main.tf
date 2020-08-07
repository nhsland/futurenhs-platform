# This requires the postgresql and kubernetes providers to be set up properly.
# Run `terraform apply -target module.platform` to set up their requirements
# before attempting to apply this module.
locals {
  databases = [
    "kratos",
    "workspace",
  ]
}

resource "random_password" "postgresql_password" {
  for_each = toset(local.databases)
  length   = 50
  special  = false
  upper    = true
}
resource "random_password" "kratos_secrets_default" {
  length  = 32
  special = false
  upper   = true
}
resource "random_password" "kratos_secrets_cookie" {
  length  = 32
  special = false
  upper   = true
}

resource "postgresql_role" "service" {
  for_each = toset(local.databases)
  name     = "${each.value}_user"
  login    = true
  password = random_password.postgresql_password[each.value].result
}

# we are using the postgresql provider here because azurerm_postgresql_database
# doesn't let us set the owner to a role other than the server admin.
resource "postgresql_database" "service" {
  for_each          = toset(local.databases)
  name              = each.value
  owner             = postgresql_role.service[each.value].name
  lc_collate        = "C"
  connection_limit  = -1
  allow_connections = true
}

resource "postgresql_extension" "uuid-ossp" {
  name     = "uuid-ossp"
  database = "workspace-db"
}

resource "kubernetes_namespace" "db" {
  for_each = toset(local.databases)
  metadata {
    name = each.value
    annotations = {
      "linkerd.io/inject" = "enabled"
    }
  }
}

resource "kubernetes_secret" "db_creds" {
  for_each = toset(local.databases)
  metadata {
    name      = "${each.value}-db-creds"
    namespace = each.value
  }
  data = {
    secretsDefault = random_password.kratos_secrets_default.result
    secretsCookie  = random_password.kratos_secrets_cookie.result
    dsn = "postgres://${
      postgresql_role.service[each.value].name
      }@${
      var.postgresql_server_name
      }:${
      random_password.postgresql_password[each.value].result
      }@${
      var.postgresql_server_name
      }.postgres.database.azure.com:5432/${
      postgresql_database.service[each.value].name
    }"
  }
}

resource "kubernetes_namespace" "frontend" {
  metadata {
    name = "frontend"
    annotations = {
      "linkerd.io/inject" = "enabled"
    }
  }
}

resource "kubernetes_secret" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.frontend.metadata[0].name
  }
  data = {
    eventgrid_topic_endpoint = var.eventgrid_topic_endpoint
    eventgrid_topic_key      = var.eventgrid_topic_key
  }
}

resource "kubernetes_namespace" "hello_world" {
  metadata {
    name = "hello-world"
    annotations = {
      "linkerd.io/inject" = "enabled"
    }
  }
}

resource "kubernetes_config_map" "frontend_telemetry" {
  metadata {
    name      = "telemetry"
    namespace = kubernetes_namespace.frontend.metadata[0].name
  }
  data = {
    instrumentation_key = var.instrumentation_key
  }
}

resource "kubernetes_config_map" "hello_world_telemetry" {
  metadata {
    name      = "telemetry"
    namespace = kubernetes_namespace.hello_world.metadata[0].name
  }
  data = {
    instrumentation_key = var.instrumentation_key
  }
}
