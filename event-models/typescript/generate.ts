import { compileFromFile } from "json-schema-to-typescript";
import { promises as fs } from "fs";

const main = async () => {
  const ts = await compileFromFile(`${__dirname}/../../schema.json`);
  await fs.writeFile(`${__dirname}/../schema.ts`, ts, "utf8");
};

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
