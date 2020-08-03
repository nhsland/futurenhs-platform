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

resource "azurerm_key_vault" "vault" {
  name                = "fnhs-shared-dev"
  location            = var.location
  resource_group_name = azurerm_resource_group.shared.name
  tenant_id           = data.azurerm_client_config.current.tenant_id

  sku_name = "premium"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    // This object_id relates to the FutureNHS Developers Group ID. 
    // See https://portal.azure.com/#blade/Microsoft_AAD_IAM/GroupDetailsMenuBlade/Overview/groupId/b06ebd00-f52c-4e82-ac88-0520f4320fee
    object_id = "b06ebd00-f52c-4e82-ac88-0520f4320fee"

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
    ]
  }

  tags = {
    environment = "dev-shared"
  }
}

// On startup, the controller searches for this secret with label 'sealedsecrets.bitnami.com/sealed-secrets-key: active' within its namespace. 
// It uses this to decrypt existing sealed secrets.
// To be able to read sealed secrets, you must add the sealed secret certificate to your cluster as a secret. 
// Run the following to retrieve it from the Key Vault:
//   az keyvault secret show --vault-name "fnhs-shared-dev" --name "sealed-secret-yaml" | jq -r '.value'  | kubectl apply -f -
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
