# Governance

## Types of changes

We distinguish between a deployment and a release.

- A **deployment** brings a code change into an environment. This code change should not have any visible consequences for end users.
- A **release** make a change visible to a set of end users.

## Deployment governance

Every change is:

- Reviewed by at least 1 other developer
- Tested using automated unit and integration tests and exploratory tests before it is deployment to production
- Tested using automated browser tests and exploratory tests in production before it is exposed to users

Those tests also ensure that the change is hidden behind a feature flag and not visible to the end user, yet. See our [testing approach](testing/test-approach.md) for more details. Because these changes are not visible to end users, deployments can be made multiple times a day. This enables quick bug fixes in case an issue has not been found earlier by the different layers of testing.

## Release governance

Every feature is:

- Hidden behind a feature flag
- Enabled by the product owner after being tested and discussed with the service team
- Sometimes gradually rolled out to subsets of users (criteria determining the set of users are to be defined, but can be things like workspace or email address)

## Diagram

![](./change-release-process.png)
