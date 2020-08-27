# Infrastructure

We use [Terraform](https://www.terraform.io/) to build our environments.

## Prerequisites

1. Install Terraform:

   ```bash
   brew install terraform
   ```

1. Install a Terraform version switcher: ([Terraform Switcher](https://github.com/warrensbox/terraform-switcher) or [chtf](https://github.com/Yleisradio/homebrew-terraforms)):

   ```bash
   brew install warrensbox/tap/tfswitch
   # or
   brew install chtf
   ```

1. Select version 0.12.25:

   ```bash
   tfswitch 0.12.25
   # or
   chtf 0.12.25
   ```

1. Install the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) and login to Azure:

   ```bash
   brew install azure-cli
   az login
   ```

1. Install [Kustomize](https://github.com/kubernetes-sigs/kustomize):

   ```bash
   brew install kustomize
   ```

1. Install [Kubeseal](https://github.com/bitnami-labs/sealed-secrets):

   ```bash
   brew install kubeseal
   ```

## Development Environment

### Setup

Infrastructure is set up so that each developer can create their own instance of the environment in Azure,
as opposed to sharing a staging environment.

1. Clone the FutureNHS Platform repository.

1. Add your name in `infrastructure/dev-overlay-variables.json` and create a pull request.

1. Set **your name** as a variable in your terminal, because we'll need to use it several times

   If your name is **John**, your commands might be as follows:

   ```bash
   FNHSNAME=john
   ```

1. Run the script with the name of your cluster as the parameter and type `yes` a lot.

   ```bash
   ./infrastructure/scripts/install-everything.sh dev-$FNHSNAME
   ```

1. To be able to login on your dev cluster, you need to add it's URL as a approved redirect URL to the Azure Active Directory B2C tenant. Please ask a colleague to get access (see "Create admin user" in [Azure Active Directory B2C docs](../docs/aad-b2c.md)), then go to "Azure AD B2C / App registrations / Development / Authentication" in the Azure Portal and add your cluster URL to the list of redirect URIs.

To reduce infrastructure costs for the NHS, please destroy your environment when you no longer need it.

```bash
./infrastructure/scripts/destroy-dev-environment.sh
```

### Working with your development environment

The installation script will install the Argo CD command line utility `argocd` for you.

The `argocd` command can connect to your Kubernetes cluster, but doesn't do this by default. This is quite annoying, so you will probably want to set this environment variable (run this once, and add it to your ~/.profile)

```bash
export ARGOCD_OPTS='--port-forward --port-forward-namespace argocd'
```

If you want to login, the username is `admin` and the password will be the name of the argocd-server pod, which you can get from:

```bash
argocd login --username admin --password $(kubectl get pods -n argocd | grep --only-matching 'argocd-server-[^ ]*')
```

If you want to view the Argo CD UI, either do this and browse to http://localhost:8080:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

or do this and browse to https://argocd-server.argocd/

```bash
brew install txn2/tap/kubefwd
sudo kubefwd services -n argocd
```

If you want to see the frontend app browse to <https://fnhs-dev-$FNHSNAME.westeurope.cloudapp.azure.com>.

If you want to switch branches in argocd, run install-argo-cd.sh specifying the branch name of the branch in the FutureNHS Deployments repository, or MINE.

```bash
./infrastructure/scripts/install-argo-cd.sh dev-$FNHSNAME MINE
```

## Production environment

Production is a long-lived environment. To make changes, follow these steps.

The `ARM_SUBSCRIPTION_ID` environment variable is needed if you're using Azure CLI authentication and production is not your default subscription (which is recommended).

1. Change directory into the production environment folder:

   ```bash
   cd infrastructure/environments/production
   ```

1. Create a `terraform.tfvars` file that contains at least `ip_whitelist_postgresql = { yourname = "your.public.ip.adddress" }` (this is needed by the postgresql terraform provider).

1. Run Terraform Init using the vars file you just created:

   ```bash
   ARM_SUBSCRIPTION_ID=75173371-c161-447a-9731-f042213a19da terraform init
   ```

1. After verifying the plan above, apply changes. The infrastructure will be created in Azure.

   ```bash
   ARM_SUBSCRIPTION_ID=75173371-c161-447a-9731-f042213a19da terraform apply -target module.platform
   ```

1. After verifying the plan above, apply changes. The infrastructure will be created in Azure.

   ```bash
   ARM_SUBSCRIPTION_ID=75173371-c161-447a-9731-f042213a19da terraform apply
   ```

1. Set `ip_whitelist_postgresql = {}` in `terraform.tfvars` and re-run terraform apply, to remove yourself from the postgresql ip whitelist.

   ```bash
   ARM_SUBSCRIPTION_ID=75173371-c161-447a-9731-f042213a19da terraform apply -target module.platform
   ```

1. Install Linkerd, Argo CD, and Sealed Secrets in the same way as it works for development environments.

   Change `kubectl` to point to the production cluster.

   ```bash
   az aks get-credentials --subscription=75173371-c161-447a-9731-f042213a19da --resource-group=platform-production --name=production
   ```

   ```bash
   kubectl config use-context production
   ```

   Install the applications.

   ```bash
   kubectl apply -f ./infrastructure/kubernetes/logging/container-azm-ms-agentconfig.yaml
   kubectl apply -f ./infrastructure/kubernetes/sealed-secrets/controller.yaml
   ./infrastructure/scripts/install-linkerd.sh production
   ./infrastructure/scripts/install-argo-cd.sh production
   ```

   And switch back to your own cluster.

   ```bash
   kubectl config use-context dev-$FNHSNAME
   ```

## Troubleshooting

- If an error occurs when applying the terraform it is possible that there is a cached version of an existing terraform set up. You can overcome this by deleting the ./infrastructure/environments/dev/.terraform/ folder and trying again.

- If your cluster fails to create, have a look at the external IP address of your ingress service:

  ```sh
  kubectl get svc -n ingress
  ```

  If it shows `<pending>` and a `kubectl describe svc -n ingress ingress-nginx-controller` shows the following error message:

  > Code="LinkedAuthorizationFailed" Message="The client '6e7bca9e-a67b-4b25-a5c4-a226ce816405' with object id '6e7bca9e-a67b-4b25-a5c4-a226ce816405' has permission to perform action 'Microsoft.Network/loadBalancers/write' on scope '/subscriptions/4a4be66c-9000-4906-8253-6a73f09f418d/resourceGroups/mc_platform-dev-jan_dev-jan_westeurope/providers/Microsoft.Network/loadBalancers/kubernetes'; however, it does not have permission to perform action 'Microsoft.Network/publicIPAddresses/join/action' on the linked scope(s) '/subscriptions/4a4be66c-9000-4906-8253-6a73f09f418d/resourceGroups/platform-dev-jan/providers/Microsoft.Network/publicIPAddresses/cluster_outbound' or the linked scope(s) are invalid."

  This means permissions have not propagated, yet, which seems to happen sometimes. It should start to work after ~15mins.
