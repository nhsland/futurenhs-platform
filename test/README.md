# Automated Testing

## Setup

Run `npm install` in the `/test/` dir to install dependencies.
Add your BrowserStack username and access key to the .env file.

Access key can be found by going to the [BrowserStack Automate Dashboard](https://automate.browserstack.com/dashboard/v2/) and clicking on the ACCESS KEY dropdown.

## Local Server Testing

These example tests are currently set up to run off a local server.

[Local API server instructions](../hello-world/README.md)

[Local frontend instructions](../frontend)

Before executing the Cypress or Browserstack tests you will need to have the local frontend server running (the API server is only necessary for the hello_world_rust.js Cypress test at this point).

## Cypress

To run Cypress locally, cd into the cypress folder and execute `npm run cypress open`.

This will open the test runner. You can then select a test you want to run and which browser you would like to run it in.

## BrowserStack

Before running any tests on BrowserStack you need to launch the BrowserStack Local executable.
From the command line, cd into the browserstack folder and execute `./BrowserStackLocal --key {accesskey} --local-identifier bslocal1`.

### Cypress

To run Cypress on BrowserStack, duplicate and edit the browserstack.json example, adding your BrowserStack username and access key.

Then execute `browserstack-cypress run`.

### Selenium

To run the Selenium test on BrowserStack, execute `node browserstack_local_test.js`.

### Mocha

To run the Mocha test on BrowserStack, execute `mocha browserstack_local_test_mocha.js`.

You can see the result of the test in the command line and [BrowserStack Automate Dashboard](https://automate.browserstack.com/dashboard/v2/).
