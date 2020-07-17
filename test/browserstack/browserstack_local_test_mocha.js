require("dotenv").config();
var webdriver = require("selenium-webdriver");
var assert = require("assert");

var userName = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

var browserstackURL = `https://${userName}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

describe("Page loads", function () {
  this.timeout(15000);
  let driver;

  before(function () {
    let capabilities = {
      os: "Windows",
      os_version: "10",
      browserName: "IE",
      browser_version: "11",
      "browserstack.local": "true",
      "browserstack.console": "errors",

      name: "Example Local Mocha Test",
    };
    driver = new webdriver.Builder()
      .usingServer(browserstackURL)
      .withCapabilities(capabilities)
      .build();
  });

  it("should render FutureNHS", (done) => {
    const expected = "FutureNHS";

    driver
      .get("http://127.0.0.1:3000")
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
