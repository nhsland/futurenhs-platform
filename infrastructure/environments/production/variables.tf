variable "location" {
  description = "Azure region"
  default     = "westeurope"
}

variable "ip_whitelist_analytics" {
  description = "List of whitelisted IPs for use with Synapse"
  type        = map(string)
}

variable "ip_whitelist_postgresql" {
  description = "List of allowed IPs for use with PostgreSQL for debugging production"
  type        = map(string)
}
