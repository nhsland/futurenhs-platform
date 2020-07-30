# 1. Setting registry and cluster.

GitHub Actions is set up to push docker images to the 'fnhsproduction' registry in the 'production' cluster.

If you want to push to another registry or another cluster then a new set of secrets need to be generated and edited in the GitHub repository.

Follow the instructions here for [secret generation](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-github-action).

# 2. Creating a Deploy Key.

The [Deploy Key](https://developer.github.com/v3/guides/managing-deploy-keys/) gives our CI server read and write access to the [Deployments repo](https://github.com/FutureNHS/futurenhs-deployments), which it needs in order to clone the repo and update the disc image tag.

## Steps to create and use the Deploy Key.

- Create an SSH key using `ssh-keygen -t rsa -b 4096 -C "futurenhs-devs@red-badger.com"`.
- When asked, leave the passphrase empty.
- Add the public part of the key to the 'Deployments' repo (settings/deploy-keys).
- Add the private part of the key to the ‘Platform’ repo as a secret (settings/secrets).
