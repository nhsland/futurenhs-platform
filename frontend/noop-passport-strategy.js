const util = require("util");

const passport = require("passport-strategy");

function Strategy() {
  passport.Strategy.call(this);
}

util.inherits(Strategy, passport.Strategy);
Strategy.prototype.authenticate = function () {
  self.success({
    id: "test",
    name: "Local User",
    emails: ["test@example.com"],
  });
};

module.exports = Strategy;
