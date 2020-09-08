const withImages = require("next-images");

module.exports = withImages({
  inlineImageLimit: 0,
  assetPrefix: process.env.ORIGIN,
});
