
#!/bin/bash

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel)"

cd $REPO_ROOT/infrastructure/environments/dev
 
terraform init -backend-config=terraform.tfvars

# The terraform provider cannot initialise itself once the `platform` module has been destroyed
# because it can't connect to the database. Therefore `terraform destroy` with no targetting
# will always fail. Once you have run these two, terraform state pull should show an empty list of
# resources.
terraform destroy -target module.databases
terraform destroy -target module.platform

terraform state pull

echo "^ Please check that the resources section above is empty ^"
echo "  If it is not empty then something is wrong."
