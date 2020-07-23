module analytics {
  source              = "../../modules/analytics"
  environment         = "dev-shared"
  location            = var.location
  resource_group_name = "vault"
  allowed_ips         = var.ip_whitelist_insights
  ad_username         = "FutureNHS Developers"
  ad_object_id        = "b06ebd00-f52c-4e82-ac88-0520f4320fee"
}
