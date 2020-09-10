// @ts-check
require("dotenv").config();

const webdriver = require("selenium-webdriver");
const assert = require("assert");

const fs = require("fs");

/**
 * @param {string} name
 * @returns {string}
 */
function env(name) {
  let value = process.env[name];
  if (!value) {
    console.error(`${name} is not set. Please add it to .env`);
    process.exit(1);
  }
  return value;
}

const userName = env("BROWSERSTACK_USERNAME");
const accessKey = env("BROWSERSTACK_ACCESS_KEY");

const baseUrl = env("IE_BASE_URL");
const browserstackURL = `https://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

const TEST_LOGIN_EMAIL_ADDRESS = env("TEST_LOGIN_EMAIL_ADDRESS");
const TEST_LOGIN_PASSWORD = env("TEST_LOGIN_PASSWORD");

if (!TEST_LOGIN_EMAIL_ADDRESS) {
  console.error("TEST_LOGIN_EMAIL_ADDRESS is not set. Please add it to .env");
  process.exit(1);
}

if (!TEST_LOGIN_PASSWORD) {
  console.error("TEST_LOGIN_PASSWORD is not set. Please add it to .env");
  process.exit(1);
}

/**
 * @param {webdriver.WebDriver} driver
 * @param {string} targetUrl
 */
async function loginIfNeeded(driver, targetUrl) {
  await driver.get(targetUrl);
  let currentUrl = await driver.getCurrentUrl();
  if (currentUrl === targetUrl) {
    return;
  }

  const emailInput = await driver.findElement(webdriver.By.css("#email"));
  const passwordInput = await driver.findElement(webdriver.By.css("#password"));
  const signInButton = await driver.findElement(webdriver.By.css("#next"));

  await emailInput.sendKeys(TEST_LOGIN_EMAIL_ADDRESS);
  await passwordInput.sendKeys(TEST_LOGIN_PASSWORD);
  await signInButton.click();

  await driver.wait(webdriver.until.urlContains(baseUrl));
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
  let driverPromise = new webdriver.Builder()
    .usingServer(browserstackURL)
    .withCapabilities(capabilities)
    .build();

  it("should redirect to / after login", async () => {
    let driver = await driverPromise;
    // `/auth/login` *always* needs to login.
    await loginIfNeeded(driver, `${baseUrl}/auth/login`);
    let currentUrl = await driver.getCurrentUrl();
    assert.equal(currentUrl, baseUrl + "/");
  });

  after(function () {
    driverPromise.quit();
  });
});
