resource "azurerm_resource_group" "platform" {
  name     = "platform-${var.environment}"
  location = var.location

  tags = {
    environment = var.environment
  }
}

resource "azurerm_virtual_network" "platform" {
  name                = "platform-${var.environment}"
  address_space       = ["10.0.0.0/8"]
  location            = var.location
  resource_group_name = azurerm_resource_group.platform.name
  tags = {
    environment = var.environment
  }
}

resource "azurerm_subnet" "cluster_nodes" {
  name                 = "cluster-nodes-${var.environment}"
  resource_group_name  = azurerm_resource_group.platform.name
  virtual_network_name = azurerm_virtual_network.platform.name
  address_prefixes     = ["10.240.0.0/16"]
}

resource "azurerm_kubernetes_cluster" "cluster" {
  name                = var.environment
  location            = var.location
  dns_prefix          = var.environment
  resource_group_name = azurerm_resource_group.platform.name

  default_node_pool {
    name                = "default"
    enable_auto_scaling = true
    max_count           = 2
    min_count           = 1
    vm_size             = "Standard_D2_v2"
    vnet_subnet_id      = azurerm_subnet.cluster_nodes.id
    availability_zones  = ["1", "2", "3"]
    tags = {
      environment = var.environment
    }
  }

  identity {
    type = "SystemAssigned"
  }

  role_based_access_control {
    enabled = true
  }

  network_profile {
    network_plugin = "kubenet"
  }

  addon_profile {
    aci_connector_linux {
      enabled = false
    }
    azure_policy {
      enabled = false
    }
    http_application_routing {
      enabled = false
    }
    kube_dashboard {
      enabled = false
    }
    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.cluster.id
    }
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_log_analytics_workspace" "cluster" {
  name                = "cluster-${var.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.platform.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = var.environment
  }
}

resource "azurerm_application_insights" "app_insights" {
  name                = "cluster-${var.environment}"
  location            = var.location
  resource_group_name = azurerm_resource_group.platform.name
  application_type    = "other"
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "_%@"
}

resource "random_string" "random_string_19_chars" {
  length  = 19
  special = false
}

data "azurerm_client_config" "current" {
}

resource "azurerm_key_vault" "secret_vault" {
  name                = "fnhs-${random_string.random_string_19_chars.result}"
  location            = var.location
  resource_group_name = azurerm_resource_group.platform.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Get",
    ]

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

resource "azurerm_key_vault_secret" "secret_synapse_password" {
  name         = "synapse-password"
  value        = random_password.password.result
  key_vault_id = azurerm_key_vault.secret_vault.id

  tags = {
    environment = var.environment
  }
}

resource "azurerm_mssql_server" "synapse_server" {
  name                         = "${azurerm_resource_group.platform.name}-synapse-sql-server"
  resource_group_name          = azurerm_resource_group.platform.name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = "nhs-admin"
  administrator_login_password = azurerm_key_vault_secret.secret_synapse_password.value
  azuread_administrator {
    login_username = var.ad_username
    object_id      = var.ad_object_id
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_sql_database" "synapse_data_warehouse" {
  name                             = "${azurerm_resource_group.platform.name}-synapse-sql-data_warehouse"
  resource_group_name              = azurerm_resource_group.platform.name
  location                         = var.location
  server_name                      = azurerm_mssql_server.synapse_server.name
  edition                          = "DataWarehouse"
  requested_service_objective_name = "DW100c"

  tags = {
    environment = var.environment
  }
}

resource "azurerm_sql_firewall_rule" "ip_whitelisted" {
  for_each            = var.ip_whitelist_insights
  name                = "ip-whitelisted-${each.key}"
  resource_group_name = azurerm_resource_group.platform.name
  server_name         = azurerm_mssql_server.synapse_server.name
  start_ip_address    = each.value
  end_ip_address      = each.value
}

resource "random_string" "postgresql_password" {
  length = 50
  special = false
  upper = true
}

resource "azurerm_postgresql_server" "postgresql_server" {
  name                = "postgresql-${var.environment}"
  location            = azurerm_resource_group.platform.location
  resource_group_name = azurerm_resource_group.platform.name

  sku_name = "B_Gen5_2"

  storage_mb                   = 5120
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  auto_grow_enabled            = true

  administrator_login          = "psqladminun"
  administrator_login_password = random_string.postgresql_password.result
  version                      = "9.5"
  ssl_enforcement_enabled      = true
}

resource "azurerm_postgresql_database" "example" {
  name                = "exampledb"
  resource_group_name = azurerm_resource_group.platform.name
  server_name         = azurerm_postgresql_server.postgresql_server.name
  charset             = "UTF8"
  collation           = "English_United States.1252"
}
