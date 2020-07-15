provider "azurerm" {
  version = "=2.14.0"
  features {}
  subscription_id = "4a4be66c-9000-4906-8253-6a73f09f418d"
}

provider "tls" {
  version = "~> 2.1"
}

terraform {
  required_version = "0.12.25"
  backend "azurerm" {
    container_name       = "vault-container"
    key                  = "dev-vault.terraform.tfstate"
    resource_group_name  = "vault"
    storage_account_name = "fnhstfstatedevshared"
  }
}

resource "tls_private_key" "sealed_secret" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "tls_self_signed_cert" "sealed_secret" {
  key_algorithm         = tls_private_key.sealed_secret.algorithm
  private_key_pem       = tls_private_key.sealed_secret.private_key_pem
  validity_period_hours = 87600 // 10 years
  allowed_uses          = []
  subject {
    common_name  = "dev-sealed-secret-cert"
    organization = "fnhs"
  }
}

data "azurerm_client_config" "current" {
}

resource "azurerm_key_vault" "vault" {
  name                = "fnhs-shared-dev"
  location            = "westeurope"
  resource_group_name = "vault"
  tenant_id           = data.azurerm_client_config.current.tenant_id

  sku_name = "premium"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = "b06ebd00-f52c-4e82-ac88-0520f4320fee"

    key_permissions = [
      "create",
      "get",
    ]

    secret_permissions = [
      "set",
      "get",
      "delete",
    ]
  }

  tags = {
    environment = "dev-shared"
  }
}


// On startup, the controller searches for this secret with label 'sealedsecrets.bitnami.com/sealed-secrets-key: active' within its namespace. It uses this to decrupt existing sealed secrets.
resource "azurerm_key_vault_secret" "sealed_secret" {
  name         = "sealed-secret-yaml"
  value        = <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: sealed-secret-key
  namespace: kube-system
  labels:
    sealedsecrets.bitnami.com/sealed-secrets-key: active
type: kubernetes.io/tls
data:
  tls.crt: ${base64encode(tls_self_signed_cert.sealed_secret.cert_pem)}
  tls.key: ${base64encode(tls_private_key.sealed_secret.private_key_pem)}
EOF
  key_vault_id = azurerm_key_vault.vault.id
}
