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

variable "enable_analytics" {
  description = "Should analytics be enabled? true or false"
  type        = bool
}

variable "ip_whitelist_analytics" {
  description = "List of allowed IPs"
  type        = map(string)
}

variable "ad_username" {
  description = "Active Directory Username"
}

variable "ad_object_id" {
  description = "Active Directory Object ID"
}

variable "kubernetes_version" {
  description = "Kubernetes Version"
  default     = "1.17.9"
}
