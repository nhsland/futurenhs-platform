require("dotenv").config();

const { until, Builder, By } = require("selenium-webdriver");
const assert = require("assert");

const { capabilities, env, loginIfNeeded } = require("./test-helpers");

const defaultTimeout = 10000;

const userName = env("BROWSERSTACK_USERNAME");
const accessKey = env("BROWSERSTACK_ACCESS_KEY");

const baseUrl = env("IE_BASE_URL");
const browserstackURL = `https://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

describe("Header with Nav bar/dropdown menu appears correctly", function () {
  this.timeout(15000);

  const driverPromise = new Builder()
    .usingServer(browserstackURL)
    .withCapabilities(capabilities("Nav menu"))
    .build();

  it("displays header correctly", async () => {
    const targetUrl = `${baseUrl}/workspaces/directory`;
    const driver = await driverPromise;

    await loginIfNeeded(driver, targetUrl);

    const desktopMenuButton = await driver.wait(
      until.elementLocated(By.css(".desktop-nav-menu")),
      defaultTimeout
    );
    const nhsLogo = await driver.wait(
      until.elementLocated(By.css(".nhsuk-logo")),
      defaultTimeout
    );
    const navBarItem = await driver.wait(
      until.elementLocated(By.css(".nav-bar-item")),
      defaultTimeout
    );
    const mobileMenu = await driver.wait(
      until.elementLocated(By.css(".mobile-nav-menu")),
      defaultTimeout
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

    const desktopMenuButton = await driver.wait(
      until.elementLocated(By.css(".desktop-nav-menu")),
      defaultTimeout
    );
    await desktopMenuButton.click();

    const nav = await driver.wait(
      until.elementLocated(By.css(".nav-list")),
      defaultTimeout
    );
    const mobileOnly = await driver.wait(
      until.elementLocated(By.css(".mobileOnly")),
      defaultTimeout
    );

    const navVisible = await nav.isDisplayed();
    const mobileOnlyVisible = await mobileOnly.isDisplayed();

    assert.strictEqual(navVisible, true);
    assert.strictEqual(mobileOnlyVisible, false);

    await desktopMenuButton.click();
    await driver.wait(until.stalenessOf(nav), defaultTimeout);
  });

  it("'My workspaces' link navigates to workspaces directory", async () => {
    const targetUrl = `${baseUrl}/admin/create-workspace`;
    const driver = await driverPromise;

    await loginIfNeeded(driver, targetUrl);

    const expected = `${baseUrl}/workspaces/directory`;

    const navBarItem = await driver.wait(
      until.elementLocated(By.css(".nav-bar-item")),
      defaultTimeout
    );
    await navBarItem.click();

    await driver.wait(until.urlContains(expected), defaultTimeout);
  });

  after(function () {
    driverPromise.quit();
  });
});
