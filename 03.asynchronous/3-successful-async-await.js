#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctionss from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");
await promisifiedDatabaseFunctionss.run(
  database,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
);
const result = await promisifiedDatabaseFunctionss.run(
  database,
  "INSERT INTO books(title) VALUES($title)",
  {
    $title: "test_book",
  },
);
console.log(result.lastID);
const row = await promisifiedDatabaseFunctionss.get(
  database,
  "SELECT * FROM books WHERE id = $id",
  {
    $id: 1,
  },
);
console.log(row.title);
await promisifiedDatabaseFunctionss.run(database, "DROP TABLE books");
await promisifiedDatabaseFunctionss.close(database);
