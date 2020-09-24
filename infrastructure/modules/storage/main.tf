resource "azurerm_storage_account" "files" {
  name                     = format("fnhsfiles%s", replace(var.environment, "-", ""))
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "RAGRS"

  tags = {
    environment = var.environment
  }
}

resource "azurerm_storage_container" "upload" {
  name                  = "upload"
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
    upload_container_name = azurerm_storage_container.upload.name
    upload_container_id   = azurerm_storage_container.upload.id
  }
}
