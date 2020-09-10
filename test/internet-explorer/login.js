// @ts-check
require("dotenv").config();

const webdriver = require("selenium-webdriver");
const assert = require("assert");

const userName = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const baseUrl = process.env.IE_BASE_URL;
const browserstackURL = `https://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

const TEST_LOGIN_EMAIL_ADDRESS = process.env.TEST_LOGIN_EMAIL_ADDRESS;
const TEST_LOGIN_PASSWORD = process.env.TEST_LOGIN_PASSWORD;

if (!TEST_LOGIN_EMAIL_ADDRESS) {
  console.error("TEST_LOGIN_EMAIL_ADDRESS is not set. Please add it to .env");
  process.exit(1);
}

if (!TEST_LOGIN_PASSWORD) {
  console.error("TEST_LOGIN_PASSWORD is not set. Please add it to .env");
  process.exit(1);
}

describe("Logging in", function () {
  this.timeout(15000);

  const capabilities = {
    os: "Windows",
    os_version: "10",
    browserName: "IE",
    browser_version: "11",
    "browserstack.local": "true",
    "browserstack.console": "errors",

    name: "Example Internet Explorer Test",
  };
  let driver = new webdriver.Builder()
    .usingServer(browserstackURL)
    .withCapabilities(capabilities)
    .build();

  it("should render login page", async () => {
    await driver.get(`${baseUrl}/auth/login`);
    console.log(await driver.takeScreenshot());
    const emailInput = await driver.findElement(webdriver.By.css("#email"));
    const passwordInput = await driver.findElement(webdriver.By.css("#email"));

    emailInput.sendKeys(TEST_LOGIN_EMAIL_ADDRESS);
    passwordInput.sendKeys(TEST_LOGIN_PASSWORD);
  });

  after(function () {
    driver.quit();
  });
});
