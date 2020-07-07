# Tech Stack

Proposed tech stack for the FutureNHS platform (based on open source and open standards where possible):

- **Microsoft Azure** for hosting
- **React** and **TypeScript** (using **Next.js**) for the frontend
- [**Rust**](#rust) for backend services
- [**GitHub Actions**](#github-actions) for continuous integration
- [**GitOps**](#gitops) for continuous deployment (using **Argo CD**)
- **Docker** to containerize our applications
- [**Kubernetes**](#kubernetes) to run and orchestrate our applications
- [**Terraform**](#terraform) for infrastructure management
- **Azure Monitor** with **Azure Application Insights** for monitoring, tracing and alerting
- [**Linkerd**](#linkerd) as a service mesh
- **Azure Blob Storage** to store files
- [**PostgreSQL**](#postgresql) to store other data

## Details about individual choices

### Terraform

We also considered **Azure Resource Manager (ARM) Templates**. ARM templates are Azure's proprietary format for declarative infrastructure management. It's possible to generate ARM templates from the Azure Portal. Arguments for Terraform are that it's platform agnostic, so developer skills are transferable and it's possible to manage multiple providers with the same tool. In our mind there is no clear best solution.

### Kubernetes

We also considered **Azure App Service**. Kubernetes provides a range of features itself and through it's ecosystem, that would be harder to build on top of App Services. Examples: auto-scaling, zero-downtime deployments, automated canary/blue-green deployments, local development.

### GitHub Actions

We also considered **Azure DevOps**. Both provide very similar functionality in terms on continuous integration pipelines. GitHub Actions integrate better with GitHub. Since the code is hosted on GitHub, we went with GitHub Actions. This is easy to change at any time.

### GitOps

We store exactly what we have to have deployed in a Git repository. A software running in the Kubernetes cluster uses it to drive deployments. This model means no person (not even the continuous integration system) needs administrator access to the Kubernetes cluster. It also gives us an audit log of what was deployed at any point in time. And it makes it easy to replicate the production environment by pointing another cluster to the same Git repository, which helps with development and disaster recovery.

More about [GitOps](https://www.gitops.tech/)

### Rust

[Why Rust?](why-rust.md) describes why we chose Rust.

However, we will also look for existing open source solutions for self-contained parts of the platform. For example we might use an existing CalDAV server to support calendars. We won't require Rust for these solutions. Instead we go with whatever is already there.

### Linkerd

Linkerd encrypts network traffic between our services, enables automated canary deployments with intelligent traffic routing, supports automated retries and timeouts and it provides diagnostic information about our network traffic.

### PostgreSQL

We also considered **Azure CosmosDB**. CosmosDB is fully managed and scales infinitelty. Unfortunately development for CosmosDB requires Windows for the emulator.

## Benefits of using open source/standards

The tech stack is made up mainly from open source software of hosted solutions based on an open standard. The GOV.UK website describes the benefits of [open source](https://www.gov.uk/guidance/be-open-and-use-open-source) and [open standards](https://www.gov.uk/government/publications/open-standards-principles/open-standards-principles) better than we could do here.

One of the benefits to call out here is avoiding vendor lock-in. If we rely on an open stack, it's likely that we can run it with minimal changes on other hosting platforms. We don't treat this as a hard requirement, though. If the costs of using an open solution compared to a proprietary ones outweight the benefits, we will go with the proprietary one. Some of these choices include:

- Azure Monitor: While we're using Azure Monitor for monitoring, tracing and alerting, we're using the [OpenTelemetry](https://opentelemetry.io/) standard to inject tracing and metric data.
- Azure Blob Storage: The service could be replaced with Amazon S3 or Google Cloud Storage without too much effort.

## A note about API gateways

We're planning to start without a dedicated API Gateway, because we don't plan to have a public API in the beginning. We may have an API, which is available on the internet, but it will be exclusively used by our platform. This means we can use cookies for authentication, which is the safest option for websites at the moment, and we are less concerned about usage quotas or other parties calling the API.
