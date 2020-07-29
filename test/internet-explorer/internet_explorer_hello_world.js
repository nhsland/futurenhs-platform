require("dotenv").config();
var webdriver = require("selenium-webdriver");
var assert = require("assert");

var userName = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

var baseUrl = process.env.IE_BASE_URL;
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

      name: "Example Internet Explorer Test",
    };
    driver = new webdriver.Builder()
      .usingServer(browserstackURL)
      .withCapabilities(capabilities)
      .build();
  });

  it("should render FutureNHS", (done) => {
    const expected = "FutureNHS";

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
