variable "environment" {
  description = "Namespace for all resources. Eg 'production' 'dev-jane'"
}

variable "location" {
  description = "Azure location"
}

variable "ip_whitelist_postgresql" {
  description = "List of allowed IPs for use with PostgreSQL"
  type        = map(string)
}
