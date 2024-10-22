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
  memoManager.showList();
} else if (options.reference) {
  memoManager.refer();
} else if (options.delete) {
  memoManager.delete();
} else {
  await memoManager.add();
}
