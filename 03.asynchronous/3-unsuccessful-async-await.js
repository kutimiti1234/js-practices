#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedFunctions from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");
await promisifiedFunctions.run(
  database,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
);
try {
  const thisProperties = await promisifiedFunctions.run(
    database,
    "INSERT INTO books(title) VALUES($title)",
    { $title: null },
  );
  console.log(thisProperties.lastID);
} catch (error) {
  if (error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  }
}
try {
  const row = await promisifiedFunctions.get(
    database,
    "SELECT error FROM books WHERE id = $id",
    {
      $id: 1,
    },
  );
  console.log(row.title);
} catch (error) {
  if (error.code === "SQLITE_ERROR") {
    console.error(error.message);
  }
}
await promisifiedFunctions.run(database, "DROP TABLE books");
database.close;
