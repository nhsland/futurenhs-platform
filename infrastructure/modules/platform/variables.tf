variable "environment" {
  description = "Namespace for all resources. Eg 'production' 'dev-jane'"
}

variable "location" {
  description = "Azure location"
}

variable "ip_whitelist_insights" {
  description = "List of whitelisted IPs for use with Synapse"
  type        = map(string)
}
