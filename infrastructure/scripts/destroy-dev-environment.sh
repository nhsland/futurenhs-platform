#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"

cd $REPO_ROOT/infrastructure/environments/dev

terraform init -backend-config=backend-config.tfvars

# The "uuid-ossp" Postgres extension cannot be deleted because there are tables
# in the database using it. However it's not necessary to delete it. We can
# just forget it ever existed. It will be removed together with the database
# itself.
UUID_DB_EXTENSION=module.databases.postgresql_extension.workspace_service_uuid_ossp
if terraform state show $UUID_DB_EXTENSION; then
	terraform state rm $UUID_DB_EXTENSION
fi

# The terraform provider cannot initialise itself once the `platform` module
# has been destroyed because it can't connect to the database. Therefore
# `terraform destroy` with no targetting will always fail. Once you have run
# these two, terraform state pull should show an empty list of resources.
terraform destroy -target module.databases

terraform destroy

terraform state pull

echo "^ Please check that the resources section above is empty ^"
echo "  If it is not empty then something is wrong."
