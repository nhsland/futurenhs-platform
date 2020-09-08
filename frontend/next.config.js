const withImages = require("next-images");
const isProd = process.env.NODE_ENV === "production";

module.exports = withImages({
  inlineImageLimit: 0,
  assetPrefix: isProd ? "__FNHS_ASSET_PREFIX__" : "",
});
