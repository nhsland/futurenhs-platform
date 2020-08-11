import { Event } from "./schema";
export * from "./schema";

import * as Ajv from "ajv";
import { readFileSync } from "fs";

const schema = JSON.parse(
  readFileSync(`${__dirname}/../../schema.json`, "utf8")
);
const ajv = new Ajv();
const validate = ajv.compile(schema);

export const parse = (s: string): Event => {
  const event: unknown = JSON.parse(s);
  if (validate(event)) {
    return event as Event;
  } else {
    throw new Error(
      "Not valid: " + validate.errors!.map((e) => e.message).join(", ")
    );
  }
};
