variable "environment" {
  description = "Namespace for all resources. Eg 'production' 'dev-jane'"
}

variable "location" {
  description = "Azure location"
}

variable "resource_group_name" {
  description = "Azure resource group name"
}

variable "allowed_ips" {
  description = "List of allowed IPs"
  type        = map(string)
}

variable "ad_username" {
  description = "Active Directory Username"
}

variable "ad_object_id" {
  description = "Active Directory Object ID"
}
