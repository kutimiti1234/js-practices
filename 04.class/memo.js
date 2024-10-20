#! /usr/bin/env node

import minimist from "minimist";
import promisifiedReadlineFunctions from "./promisified-readline-functions.js";
import Manager from "./manager.js";

const options = minimist(process.argv.slice(2), {
  alias: {
    l: "list",
    r: "reference",
    d: "delete",
  },
});

const memoManager = new Manager();
await memoManager.createTable();

if (options.list) {
  memoManager.showList();
} else if (options.reference) {
  memoManager.refer();
} else if (options.delete) {
  memoManager.delete();
} else {
  const lines = await promisifiedReadlineFunctions.inputLines();
  await memoManager.add(lines[0], lines.slice(1).join("\n"));
}
