variable "resource_group_name" {
  description = "Used by backend config. If you see this message, run [root]/infrastructure/scripts/create-dev-environment.sh and follow the instructions it prints."
}
variable "storage_account_name" {
  description = "Used by backend config. If you see this message, run [root]/infrastructure/scripts/create-dev-environment.sh and follow the instructions it prints."
}

variable "USERNAME" {
  description = "All resources will be grouped by environment - use your name"
}

variable "location" {
  description = "Azure region"
  default     = "westeurope"
}

variable "ip_whitelist_insights" {
  description = "List of allowed IPs for use with Synapse for insights. Check infrastructure/README.md for instructions on how to fill this in."
  type        = map(string)
}

variable "ip_whitelist_postgresql" {
  description = "List of allowed IPs for use with PostgreSQL for local development. Check infrastructure/README.md for instructions on how to fill this in."
  type        = map(string)
}
