# Docker & Kubernetes

## Docker

- Keep base images up to date (dependabot)
- Use official and tested base images where possible (debian)
- Use small images without unnecessary software packages, which can add security vulnerabilities (debian slim)
- Scan images (Azure Security Center)
- Don't store secrets in images. Instead pass then in at runtime using environment variables
- Don't run as root (TODO)
- Drop unnecessary capabilities (TODO)
- Define resource limits (TODO)

## Kubernetes

- Use a managed cluster (e.g. AKS, GKE, EKS), which secures access to nodes and master
- Use RBAC
- Use namespaces to give pods minimal access to secrets
- Enforce network policies, e.g. with NetworkPolicy or Istio (TODO)
- Use Pod Security Policy to enforce e.g. a read-only file system (TODO)
