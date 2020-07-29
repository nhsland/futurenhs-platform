# This requires the postgresql and terraform providers to be set up properly.
# Run `terraform apply -target module.platform` to set up their requirements
# before attempting to apply this module.

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
      var.postgresql_server_name
      }:${
      random_password.kratos_postgresql_password.result
      }@${
      var.postgresql_server_name
      }.postgres.database.azure.com:5432/${
      postgresql_database.kratos_db.name
    }"
  }
}
