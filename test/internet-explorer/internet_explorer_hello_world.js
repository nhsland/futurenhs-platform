require("dotenv").config();

const webdriver = require("selenium-webdriver");
const assert = require("assert");

const userName = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

const baseUrl = process.env.IE_BASE_URL;
const browserstackURL = `https://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

describe("Page loads", function () {
  this.timeout(15000);
  let driver;

  before(function () {
    const capabilities = {
      os: "Windows",
      os_version: "10",
      browserName: "IE",
      browser_version: "11",
      "browserstack.local": "true",
      "browserstack.console": "errors",

      name: "Example Internet Explorer Test",
    };
    driver = new webdriver.Builder()
      .usingServer(browserstackURL)
      .withCapabilities(capabilities)
      .build();
  });

  it("should render hype page", (done) => {
    const expected = "The new Future is coming...";

    driver
      .get(baseUrl)
      .then(() => {
        driver.findElement(webdriver.By.css("p")).then((p) => {
          p.getText()
            .then((result) => {
              assert.equal(result, expected);
              done();
            })
            .catch(done);
        });
      })
      .catch(done);
  });

  after(function () {
    driver.quit();
  });
});
