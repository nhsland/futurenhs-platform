# Tech Stack

Proposed tech stack for the FutureNHS platform:

- **Microsoft Azure** for hosting

- **Terraform** for infrastructure management

  Also considered **Azure Resource Manager (ARM) Templates**. That's Azure's proprietary format for declarative infrastructure management. It's possible to generate ARM templates from the Azure Portal. Arguments for Terraform are that it's platform agnostic, so developer skills are transferable and it's possible to manage multiple providers with the same tool. There is no clear best solution.

- **Docker** to containerize our applications

- **Kubernetes** to run and orchestrate our applications

  Also considered **Azure App Service**. Kubernetes provides a range of features itself and in it's ecosystem, that would be harder to build on top of App Services, e.g.: auto-scaling, zero-downtime deployments, automated canary/blue-green deployments, local development.

- **GitHub Actions** for continuous integration

  Also considered **Azure DevOps**. Both provide very similar functionality in terms on continuous integration pipelines. GitHub Actions integrate better with GitHub. Since the code is hosted on GitHub, we went with GitHub Actions. This is easy to change at any time.

- [**GitOps**](https://www.gitops.tech/) for continuous deployment (using **Argo CD**).

  We store exactly what we have to have deployed in a Git repository. A software running in the Kubernetes cluster uses it to drive deployments. This model means no person (not even the continuous integration system) needs administrator access to the Kubernetes cluster. It also gives us an audit log of what was deployed at any point in time. And it makes it easy to replicate the production environment by pointing another cluster to the same Git repository, which helps with development and disaster recovery.

- **React** and **TypeScript** (using **Next.js**) for the frontend

- **Rust** for backend services

  We will look for existing open source solutions for self-contained parts of the platform. For example we might deploy an existing CalDAV server to support calendars. We won't require Rust for these solutions. Instead we go with whatever is already there.

- **Azure Monitor** with **Azure Application Insights** for monitoring, tracing and alerting

- **Linkerd** as a service mesh

  A service mesh encrypts network traffic between our services, enables automated canary deployments with intelligent traffic routing, supports automated retries and timeouts and it provides diagnostic information about our network traffic.

- **Azure Blob Storage** to store files

* **PostgreSQL** to store other data

  Also considered **Azure CosmosDB**. It's fully managed and scales infinitelty. Unfortunately development for CosmosDB requires Windows for the emulator.

## A note about API gateways

We're planning to start without a dedicated API Gateway, because we don't plan to have a public API in the beginning. We may have an API, which is available on the internet, but it will be exclusively used by our platform. This means we can use cookies for authentication, which is the safest option for websites at the moment, and we are less concerned about usage quotas or other parties calling the API.
