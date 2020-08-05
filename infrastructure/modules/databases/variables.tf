variable "environment" {
  description = "Namespace for all resources. Eg 'production' 'dev-jane'"
}

variable "postgresql_server_name" {
  description = "Name of the PostgreSQL server, where databases and users should be created"
}

variable "resource_group_name" {
  description = "Name of the platform resource group"
}

variable "eventgrid_topic_name" {
  description = "Name of the platform Event Grid Topic"
}
