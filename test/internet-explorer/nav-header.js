require("dotenv").config();

const webdriver = require("selenium-webdriver");
const assert = require("assert");

const { env, loginIfNeeded } = require("./test-helpers");

const userName = env("BROWSERSTACK_USERNAME");
const accessKey = env("BROWSERSTACK_ACCESS_KEY");

const baseUrl = env("IE_BASE_URL");
const browserstackURL = `https://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

describe("Header with Nav bar/dropdown menu appears correctly", function () {
  this.timeout(60000);

  const capabilities = {
    os: "Windows",
    os_version: "10",
    browserName: "IE",
    browser_version: "11",
    "browserstack.local": "true",
    "browserstack.console": "errors",

    name: "Nav Menu",
  };
  const driverPromise = new webdriver.Builder()
    .usingServer(browserstackURL)
    .withCapabilities(capabilities)
    .build();

  it("displays header correctly", async () => {
    const targetUrl = `${baseUrl}/workspaces/directory`;
    const driver = await driverPromise;

    await loginIfNeeded(driver, targetUrl);
    await driver.get(targetUrl);

    const desktopMenuButton = await driver.findElement(
      webdriver.By.css(".desktop-nav-menu")
    );
    const nhsLogo = await driver.findElement(webdriver.By.css(".nhsuk-logo"));
    const navBarItem = await driver.findElement(
      webdriver.By.css(".nav-bar-item")
    );
    const mobileMenu = await driver.findElement(
      webdriver.By.css(".mobile-nav-menu")
    );
    const desktopMenuButtonVisible = await desktopMenuButton.isDisplayed();
    const nhsLogoVisible = await nhsLogo.isDisplayed();
    const navBarItemVisible = await navBarItem.isDisplayed();
    const mobileMenuVisible = await mobileMenu.isDisplayed();

    assert.strictEqual(desktopMenuButtonVisible, true);
    assert.strictEqual(nhsLogoVisible, true);
    assert.strictEqual(navBarItemVisible, true);
    assert.strictEqual(mobileMenuVisible, false);
  });

  it("menu can be opened/closed", async () => {
    const targetUrl = `${baseUrl}/workspaces/directory`;
    const driver = await driverPromise;

    await loginIfNeeded(driver, targetUrl);
    await driver.get(targetUrl);

    const desktopMenuButton = await driver.findElement(
      webdriver.By.css(".desktop-nav-menu")
    );
    desktopMenuButton.click();

    const nav = await driver.findElement(webdriver.By.css("nav-list"));
    console.log(nav);
    const mobileOnly = await driver.findElement(
      webdriver.By.css(".mobileOnly")
    );
    const navVisible = await nav.isDisplayed();
    const mobileOnlyVisible = await mobileOnly.isDisplayed();

    assert.strictEqual(navVisible, true);
    assert.strictEqual(mobileOnlyVisible, false);

    desktopMenuButton.click();
    assert.strictEqual(navVisible, false);
  });

  it("'My workspaces' link navigates to workspaces directory", async () => {
    const targetUrl = `${baseUrl}/admin/create-workspace`;
    const driver = await driverPromise;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    await loginIfNeeded(driver, targetUrl);
    await driver.get(targetUrl);

    const expected = `${baseUrl}/workspaces/directory`;

    const navBarItem = await driver.findElement(
      webdriver.By.css(".nav-bar-item")
    );
    navBarItem.click();
    delay(10000);

    const h1 = await driver.findElement(webdriver.By.css("h1"));
    const h1Result = await h1.getText();
    assert.equal(h1Result, "My workspaces");

    const result = await driver.getCurrentUrl().then((currentUrl) => {
      return currentUrl;
    });

    assert.strictEqual(result, expected);
  });
});
