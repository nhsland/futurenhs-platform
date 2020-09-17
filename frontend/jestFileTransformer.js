// fileTransformer.js from https://jestjs.io/docs/en/webpack#mocking-css-modules with modifications

module.exports = {
  process(src, filename) {
    return (
      "module.exports = " +
      JSON.stringify(filename.replace(/^.*frontend/, "")) +
      ";"
    );
  },
};
