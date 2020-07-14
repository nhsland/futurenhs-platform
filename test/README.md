# Automated Testing

## Setup

Run `yarn` in the `/test/` dir to install dependencies.
Add your BrowserStack username and access key to the .env file.

Access key can be found by going to the [BrowserStack Automate Dashboard](https://automate.browserstack.com/dashboard/v2/) and clicking on the ACCESS KEY dropdown.

Install the BrowserStack Local executable `brew cask install browserstacklocal`

## Local Server Testing

These example tests are currently set up to run off a local server.

[Local API server instructions](../hello-world/README.md)

[Local frontend instructions](../frontend)

Before executing the Cypress or Browserstack tests you will need to have the local frontend server running (the API server is only necessary for the hello_world_rust.js Cypress test at this point).

## Cypress

To run Cypress locally, execute `yarn cypress` in the /test/ directory.

This will open the test runner. You can then select a test you want to run and which browser you would like to run it in.

- Please note \* that the tests are currently not setup to run locally - the test url is set to bs-local.com, rather than localhost. You will need to modify the url to point at localhost if you want to test locally. This will be resolved in a later PR.

## BrowserStack

Before running local tests on BrowserStack make sure the BrowserStack Local executable is [installed](#setup).
Use `yarn local` to launch the executable.

### Cypress

To run Cypress on BrowserStack, duplicate and edit the browserstack.json example, adding your BrowserStack username and access key.

From the `/test/` directory, execute `yarn cypress-bs`.

### Mocha

Mocha tests run using the Selenium webdriver.

To run the Mocha test on BrowserStack, execute `yarn mocha-bs`.

#### Selenium

The 'Selenium' test is essentially the same as the Mocha test, just without the Mocha syntax and formatting.

To run the Selenium test on BrowserStack, from the /browserstack/ directory, execute `node browserstack_local_test.js`.
