resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "_%@"
}

resource "random_string" "random_string_9_chars" {
  length  = 9
  special = false
}

data "azurerm_client_config" "current" {
}

resource "azurerm_key_vault" "secret_vault" {
  name                = "fnhs-analytics-${random_string.random_string_9_chars.result}"
  location            = var.location
  resource_group_name = var.resource_group_name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    // This object_id relates to the FutureNHS Developers Group ID. 
    // See https://portal.azure.com/#blade/Microsoft_AAD_IAM/GroupDetailsMenuBlade/Overview/groupId/b06ebd00-f52c-4e82-ac88-0520f4320fee
    object_id = "b06ebd00-f52c-4e82-ac88-0520f4320fee"

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
      "List",
    ]
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_key_vault_secret" "synapse_password" {
  name         = "synapse-password"
  value        = random_password.password.result
  key_vault_id = azurerm_key_vault.secret_vault.id

  tags = {
    environment = var.environment
  }
}

resource "azurerm_mssql_server" "synapse" {
  name                         = "${var.environment}-synapse"
  resource_group_name          = var.resource_group_name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = "nhs-admin"
  administrator_login_password = azurerm_key_vault_secret.synapse_password.value
  azuread_administrator {
    login_username = var.ad_username
    object_id      = var.ad_object_id
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_sql_database" "synapse_data_warehouse" {
  name                             = "${var.environment}-synapse-dw"
  resource_group_name              = var.resource_group_name
  location                         = var.location
  server_name                      = azurerm_mssql_server.synapse.name
  edition                          = "DataWarehouse"
  requested_service_objective_name = "DW100c"

  tags = {
    environment = var.environment
  }
}

resource "azurerm_sql_firewall_rule" "allow_ip" {
  for_each            = var.allowed_ips
  name                = "allow-ip-${each.key}"
  resource_group_name = var.resource_group_name
  server_name         = azurerm_mssql_server.synapse.name
  start_ip_address    = each.value
  end_ip_address      = each.value
}
