resource "azurerm_storage_account" "files" {
  name                     = format("fnhsfiles%s", replace(var.environment, "-", ""))
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "RAGRS"


  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["DELETE", "GET", "HEAD", "MERGE", "POST", "OPTIONS", "PUT", "PATCH"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 60 * 60 * 24
    }
  }

  tags = {
    environment = var.environment
  }
}

resource "azurerm_storage_container" "upload" {
  name                  = "upload"
  storage_account_name  = azurerm_storage_account.files.name
  container_access_type = "private"
}

resource "azurerm_storage_container" "files" {
  name                  = "files"
  storage_account_name  = azurerm_storage_account.files.name
  container_access_type = "private"
}

resource "kubernetes_secret" "workspace_svc_files_storage_account" {
  metadata {
    name      = "files-storage-account"
    namespace = "workspace-service"
  }
  data = {
    primary_access_key = azurerm_storage_account.files.primary_access_key
  }
}

resource "kubernetes_config_map" "workspace_svc_files_storage_account" {
  metadata {
    name      = "files-storage-account"
    namespace = "workspace-service"
  }
  data = {
    upload_container_id = azurerm_storage_container.upload.id
    files_container_id  = azurerm_storage_container.files.id
  }
}
