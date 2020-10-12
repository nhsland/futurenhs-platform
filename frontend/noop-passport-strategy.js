const util = require("util");

const passport = require("passport-strategy");

const { getOrCreateUser } = require("./lib/server/graphql");

function Strategy() {
  passport.Strategy.call(this);
}

util.inherits(Strategy, passport.Strategy);
Strategy.prototype.authenticate = async function () {
  const testAuthId = "0c8109ef-c247-4c41-b679-b609866487b9";
  const testName = "Local User";
  const response = await getOrCreateUser({
    authId: testAuthId,
    name: testName,
  });
  const {
    getOrCreateUser: { name, authId, is_platform_admin: isPlatformAdmin },
  } = response;
  var self = this;
  self.success({
    authId,
    name,
    isPlatformAdmin,
    emails: ["test@example.com"],
  });
};

module.exports = Strategy;
