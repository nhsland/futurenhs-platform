variable "environment" {
  description = "Namespace for all resources. Eg 'production' 'dev-jane'"
}
variable "postgresql_server_name" {
  description = "Name of the PostgreSQL server, where databases and users should be created"
}
