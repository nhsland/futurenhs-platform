const { capabilities } = require("./capabilities");
const { delay } = require("./delay");
const { env } = require("./env-vars");
const { loginIfNeeded } = require("./login-if-needed");
const { takeScreenshot } = require("./take-screenshot");

module.exports = { capabilities, delay, env, loginIfNeeded, takeScreenshot };
