#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

const database = new sqlite3.Database(":memory:");
await promisifiedDatabaseFunctions.run(
  database,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
);
const result = await promisifiedDatabaseFunctions.run(
  database,
  "INSERT INTO books(title) VALUES($title)",
  {
    $title: "test_book",
  },
);
console.log(result.lastID);
const row = await promisifiedDatabaseFunctions.get(
  database,
  "SELECT * FROM books WHERE id = $id",
  {
    $id: 1,
  },
);
console.log(row.title);
await promisifiedDatabaseFunctions.run(database, "DROP TABLE books");
await promisifiedDatabaseFunctions.close(database);
