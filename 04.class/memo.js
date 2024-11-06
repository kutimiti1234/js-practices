#! /usr/bin/env node

import minimist from "minimist";
import MemoManager from "./memo-manager.js";

const options = minimist(process.argv.slice(2), {
  alias: {
    l: "list",
    r: "reference",
    d: "delete",
  },
});

const memoManager = new MemoManager();
await memoManager.initializeDatabase();

if (options.list) {
  await memoManager.showList();
} else if (options.reference) {
  await memoManager.refer();
} else if (options.delete) {
  await memoManager.delete();
} else {
  await memoManager.add();
}

await memoManager.finalizeDatabase();
