#! /usr/bin/env node

import minimist from "minimist";
import sqlite3 from "sqlite3";
import readline from "readline";
import Manager from "./manager.js";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

const options = minimist(process.argv.slice(2), {
  alias: {
    l: "list",
    r: "reference",
    d: "delete",
  },
});

const database = new sqlite3.Database(".sqlite3");
await promisifiedDatabaseFunctions.run(
  database,
  "CREATE TABLE IF NOT EXISTS memo(id INTEGER PRIMARY KEY AUTOINCREMENT, title NOT NULL, body NOT NULL)",
);
const notesManager = new Manager(database);

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
    await notesManager.add(lines[0], lines.slice(1).join("\n"));
  });
} else if (options.list) {
  notesManager.showList();
} else if (options.reference) {
  notesManager.refer();
} else if (options.delete) {
  notesManager.delete();
}
