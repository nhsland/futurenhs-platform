resource "azurerm_eventhub" "analytics" {
  name                = "analytics"
  count               = var.enable_analytics ? 1 : 0
  namespace_name      = azurerm_eventhub_namespace.platform.name
  resource_group_name = azurerm_resource_group.platform.name
  partition_count     = 1
  message_retention   = 1
}

resource "azurerm_eventgrid_event_subscription" "analytics" {
  name                 = "analytics"
  count                = var.enable_analytics ? 1 : 0
  scope                = azurerm_eventgrid_topic.platform.id
  eventhub_endpoint_id = azurerm_eventhub.analytics[0].id
}


resource "azurerm_stream_analytics_job" "analytics" {
  name                                     = "analytics"
  count                                    = var.enable_analytics ? 1 : 0
  resource_group_name                      = azurerm_resource_group.platform.name
  location                                 = var.location
  compatibility_level                      = "1.1"
  data_locale                              = "en-GB"
  events_late_arrival_max_delay_in_seconds = 60
  events_out_of_order_max_delay_in_seconds = 50
  events_out_of_order_policy               = "Adjust"
  output_error_policy                      = "Drop"
  streaming_units                          = 1

  tags = {
    environment = var.environment
  }

  transformation_query = <<QUERY
    SELECT *
    INTO analyticstreamsoutput
    FROM analyticsstreaminput
  QUERY

}

resource "azurerm_eventhub_consumer_group" "analytics" {
  name                = "analytics"
  count               = var.enable_analytics ? 1 : 0
  namespace_name      = azurerm_eventhub_namespace.platform.name
  eventhub_name       = azurerm_eventhub.analytics[count.index].name
  resource_group_name = azurerm_resource_group.platform.name
}

resource "azurerm_stream_analytics_stream_input_eventhub" "analyticsstreaminput" {
  name                         = "analyticsstreaminput"
  count                        = var.enable_analytics ? 1 : 0
  stream_analytics_job_name    = azurerm_stream_analytics_job.analytics[0].name
  resource_group_name          = azurerm_resource_group.platform.name
  eventhub_consumer_group_name = azurerm_eventhub_consumer_group.analytics[0].name
  eventhub_name                = azurerm_eventhub.analytics[count.index].name
  servicebus_namespace         = azurerm_eventhub_namespace.platform.name
  shared_access_policy_key     = azurerm_eventhub_namespace.platform.default_primary_key
  shared_access_policy_name    = "RootManageSharedAccessKey"

  serialization {
    type     = "Json"
    encoding = "UTF8"
  }
}

resource "azurerm_storage_account" "analytics" {
  name                     = "fnhsanalytics${replace(var.environment, "-", "")}"
  count                    = var.enable_analytics ? 1 : 0
  resource_group_name      = azurerm_resource_group.platform.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "analytics" {
  name                  = "analytics"
  count                 = var.enable_analytics ? 1 : 0
  storage_account_name  = azurerm_storage_account.analytics[0].name
  container_access_type = "private"
}

resource "azurerm_stream_analytics_output_blob" "analyticstreamsoutput" {
  name                      = "analyticstreamsoutput"
  count                     = var.enable_analytics ? 1 : 0
  stream_analytics_job_name = azurerm_stream_analytics_job.analytics[0].name
  resource_group_name       = azurerm_resource_group.platform.name
  storage_account_name      = azurerm_storage_account.analytics[0].name
  storage_account_key       = azurerm_storage_account.analytics[0].primary_access_key
  storage_container_name    = azurerm_storage_container.analytics[0].name
  path_pattern              = "analytics"
  date_format               = "yyyy-MM-dd"
  time_format               = "HH"

  serialization {
    type     = "Json"
    encoding = "UTF8"
    format   = "LineSeparated"
  }
}


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
  count               = var.enable_analytics ? 1 : 0
  location            = var.location
  resource_group_name = azurerm_resource_group.platform.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = var.ad_object_id

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


resource "azurerm_key_vault_secret" "analytics_password" {
  name         = "analytics-password"
  count        = var.enable_analytics ? 1 : 0
  value        = random_password.password.result
  key_vault_id = azurerm_key_vault.secret_vault[0].id

  tags = {
    environment = var.environment
  }
}

resource "azurerm_mssql_server" "analytics" {
  name                         = "${var.environment}-analytics"
  count                        = var.enable_analytics ? 1 : 0
  resource_group_name          = azurerm_resource_group.platform.name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = "nhs-admin"
  administrator_login_password = azurerm_key_vault_secret.analytics_password[0].value
  azuread_administrator {
    login_username = var.ad_username
    object_id      = var.ad_object_id
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_sql_database" "analytics_data_warehouse" {
  name                = "${var.environment}-analytics-dw"
  count               = var.enable_analytics ? 1 : 0
  resource_group_name = azurerm_resource_group.platform.name
  location            = var.location
  server_name         = azurerm_mssql_server.analytics[0].name

  //  To upgrade to Synapse, uncomment the below 2 comments
  //  edition = "DataWarehouse"
  //  requested_service_objective_name = "DW100c"

  tags = {
    environment = var.environment
  }
}

resource "azurerm_sql_firewall_rule" "allow_ip" {
  for_each            = var.enable_analytics ? var.ip_whitelist_analytics : {}
  name                = "allow-ip-${each.key}"
  resource_group_name = azurerm_resource_group.platform.name
  server_name         = azurerm_mssql_server.analytics[0].name
  start_ip_address    = each.value
  end_ip_address      = each.value
}

resource "azurerm_data_factory" "analytics" {
  name                = "analytics-${var.environment}"
  count               = var.enable_analytics ? 1 : 0
  resource_group_name = azurerm_resource_group.platform.name
  location            = var.location
}

resource "azurerm_data_factory_pipeline" "analytics" {
  name                = "analytics"
  count               = var.enable_analytics ? 1 : 0
  resource_group_name = azurerm_resource_group.platform.name
  data_factory_name   = azurerm_data_factory.analytics[0].name
}
