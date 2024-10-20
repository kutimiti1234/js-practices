#! /usr/bin/env node

import minimist from "minimist";
import readline from "readline";
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

if (!options.list && !options.reference && !options.delete) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const lines = [];
  rl.on("line", (line) => {
    lines.push(line);
  });
  rl.on("SIGINT", () => {
    process.exit(130);
  });
  rl.on("close", async () => {
    await memoManager.add(lines[0], lines.slice(1).join("\n"));
  });
} else if (options.list) {
  memoManager.showList();
} else if (options.reference) {
  memoManager.refer();
} else if (options.delete) {
  memoManager.delete();
}
