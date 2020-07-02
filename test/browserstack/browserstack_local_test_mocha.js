require("dotenv").config();
var webdriver = require("selenium-webdriver");
var assert = require("assert");

var userName = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;

var browserstackURL =
  "https://" +
  userName +
  ":" +
  accessKey +
  "@hub-cloud.browserstack.com/wd/hub";

describe("Page loads", function () {
  this.timeout(15000);
  let driver;

  before(function () {
    console.log("starting driver");
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

  it("should render h1", (done) => {
    const expected = "[Your Name]";

    let result;
    driver
      .get("http://127.0.0.1:3000")
      .then(() => {
        driver.findElement(webdriver.By.css("h1")).then((h1) => {
          h1.getText()
            .then((text) => {
              result = text;
              assert.equal(result, expected);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
  });

  after(function () {
    driver.quit();
  });
});
