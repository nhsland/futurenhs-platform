# Governance

## Incremental feature changes

Example: Add preview functionality for documents.

We distinguish between a deployment and a release.

- A **deployment** brings a code change into an environment. This code change should not have any visible consequences for end users.
- A **release** make a change visible to a set of end users.

### Deployment

Every change is:

- Reviewed by at least 1 other developer
- Tested using automated unit and integration tests and exploratory tests before it is deployment to production
- Tested using automated browser tests and exploratory tests in production before it is exposed to users

Those tests also ensure that the change is hidden behind a feature flag and not visible to the end user, yet. See our [testing approach](testing/test-approach.md) for more details. Because these changes are not visible to end users, deployments can be made multiple times a day. This enables quick bug fixes in case an issue has not been found earlier by the different layers of testing.

### Release

Every feature is:

- Hidden behind a feature flag
- Enabled by the product owner after being tested and discussed with the service team
- Sometimes gradually rolled out to subsets of users (criteria determining the set of users are to be defined, but can be things like workspace or email address)

## Project changes

Example: Add workflow engine.

Bigger changes to the platform will go through the approval process in the Architecture Review Board. This ensures we're not duplicating effort for something, that already exists somewhere else in the organization. The following diagram outlines the change and release process.

![](./change-release-process.png)
