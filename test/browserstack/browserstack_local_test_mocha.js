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

  // it("should render h1", function (done) {
  //   const expected = "[Your Name]";

  //   let result;
  //   driver.get("http://127.0.0.1:3000").then(async () => {
  //     try {
  //       await driver.findElement(webdriver.By.css("h1")).then(async (h1) => {
  //         result = await h1.getText();
  //       });
  //       console.log(result);
  //       assert.equal(result, expected);
  //       done();
  //     } catch (err) {
  //       console.log(err);
  //       done();
  //     }
  //   });
  //   // .catch(function (err) {
  //   //   console.log(err);
  //   // });
  // });

  it("should render h1", function (done) {
    const expected = "[Your Name]";

    let result;
    driver
      .get("http://127.0.0.1:3000")
      .then(function () {
        driver.findElement(webdriver.By.css("h1")).then(function (h1) {
          result = h1.getText();
          done();
        });
      })
      .catch(function (err) {
        console.log(err);
        done();
      });
  });

  //   assert.equal(result, expected)
  // } catch (err) {
  //   console.log(err);
  // }

  // try {
  //   assert.equal(result, expected);
  // } catch (err) {
  //   console.log(err);
  // }
  // done();
  // });

  after(function () {
    driver.quit();
  });
});
