resource "azurerm_storage_account" "files" {
  name                     = "fnhsfiless${replace(var.environment, "-", "")}"
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "RAGRS"

  tags = {
    environment = var.environment
  }
}

resource "kubernetes_secret" "workspace_svc_files_storage_account" {
  metadata {
    name      = "files-storage-account"
    namespace = "workspace-service"
  }
  data = {
    blob_access_key = azurerm_storage_account.files.primary_access_key
  }
}
