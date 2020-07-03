# Tech Stack

Proposed tech stack for the FutureNHS platform

-	**Azure** for hosting
-	**Terraform** for infrastructure management
-	**Docker** to containerize our applications
-	**Kubernetes** to run and orchestrate our applications
-	**GitHub Actions** for continuous integration
-	**Argo CD** for continuous deployment with GitOps (we store exactly what's currently deployed in Git repository and use that repository to drive deployments)
-	**React** and **TypeScript** (using **Next.js**) for the frontend
-	**Rust** for backend services
-	**Azure Application Insights** and **Azure Monitor** for monitoring, tracing and alerting
-	**Linkerd** as a service mesh instead of an API gateway. It secures traffic between our services, can handle canary deployments, retries and timeouts and gives us detailed diagnostics about the network traffic.
-	**Azure Blob Storage** to store files
-	**Azure CosmosDB** or possibly **PostgreSQL** to store other data
