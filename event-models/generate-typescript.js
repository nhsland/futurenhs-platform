const { compileFromFile } = require("json-schema-to-typescript");
const { promises: fs } = require("fs");

const main = async () => {
  const ts = await compileFromFile(`${__dirname}/schema.json`);
  await fs.writeFile(`${__dirname}/typescript/src/schema.ts`, ts, "utf8");
};

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
