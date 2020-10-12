const util = require("util");

const passport = require("passport-strategy");

const { getOrCreateUser } = require("./graphql");

function Strategy() {
  passport.Strategy.call(this);
}

util.inherits(Strategy, passport.Strategy);
Strategy.prototype.authenticate = async function () {
  // Test value that's an auto generated V4 UUID
  const testAuthId = "0c8109ef-c247-4c41-b679-000000000000";
  const testName = "Local User";

  const response = await getOrCreateUser({
    authId: testAuthId,
    name: testName,
  });

  const { id, name, authId, isPlatformAdmin } = response.getOrCreateUser;

  this.success({
    id,
    authId,
    name,
    isPlatformAdmin,
    emails: ["test@example.com"],
  });
};

module.exports = Strategy;
