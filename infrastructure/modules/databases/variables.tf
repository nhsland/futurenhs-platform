variable "environment" {
  description = "Namespace for all resources. Eg 'production' 'dev-jane'"
}
# TODO: I don't think we need this anymore if we have the terraform provider.
variable "postgresql_admin_password" {
  description = "Admin password for the postgresql server"
}
variable "postgresql_server_name" {
  description = "Admin password for the postgresql server"
}