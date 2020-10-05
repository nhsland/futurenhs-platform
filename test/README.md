# Automated Testing for Internet Explorer

## Setup

To get started, you should have [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) installed. If you don't have it already, install Yarn `npm install -g yarn`.

Run `yarn` in the `/test/` directory to install dependencies.
Add your BrowserStack username and access key to the .env file.

Access key can be found by going to the [BrowserStack Automate Dashboard](https://automate.browserstack.com/dashboard/v2/) and clicking on the ACCESS KEY dropdown.

Install the BrowserStack Local executable `brew cask install browserstacklocal`.

## Running Tests

If you wish to test locally, before running the Internet Explorer tests you will need to have the frontend server running.

[Local frontend instructions](../frontend)

Workspaces tests currently only work against Prod. For local you need to either:

- manually create a Workspace named "Selenium Testing" in your local/dev cluster environment
- For local the name must match what is set in your .env file against "TEST_WORKSPACE_NAME"
- In prod, it is explicitly set to "Selenium Testing"
  OR
- run script
  ```bash
  ./workspace-service/scripts/create-workspace-if-needed.sh
  ```

Before running local tests on BrowserStack make sure the BrowserStack Local executable is [installed](#setup).
Execute `yarn local` (from the /test/ directory) to launch the executable before running any of the following tests.

To run tests, execute the desired command from the `/test/` directory:

- a local server: `yarn internet-explorer-bs:local`.
- a dev cluster: `yarn internet-explorer-bs:dev <dev cluster name>` i.e. `yarn internet-explorer-bs:dev foo`.
- prod: `yarn internet-explorer-bs:prod`.
