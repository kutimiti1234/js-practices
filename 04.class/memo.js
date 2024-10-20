#! /usr/bin/env node

import minimist from "minimist";
import promisifiedinputhelper from "./promisified-input-helper.js";
import MemoManager from "./memo-manager.js";

const options = minimist(process.argv.slice(2), {
  alias: {
    l: "list",
    r: "reference",
    d: "delete",
  },
});

const memoManager = new MemoManager();
await memoManager.createTable();

if (options.list) {
  memoManager.showList();
} else if (options.reference) {
  memoManager.refer();
} else if (options.delete) {
  memoManager.delete();
} else {
  const lines = await promisifiedinputhelper.inputLines();
  if (lines[0] === undefined) {
    lines[0] = "No title";
  }
  const content = lines.join("\n");
  await memoManager.add(content);
}
