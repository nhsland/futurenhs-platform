variable "location" {
  description = "Azure region"
  default     = "westeurope"
}

variable "ip_whitelist_analytics" {
  description = "List of whitelisted IPs for use with Synapse"
  type        = map(string)
}

variable "enable_analytics" {
  description = "Should analytics be enabled? true or false"
  type        = bool
}

variable "ip_whitelist_postgresql" {
  description = "List of allowed IPs for use with PostgreSQL for debugging production"
  type        = map(string)
}
