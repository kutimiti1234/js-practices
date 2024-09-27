#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedFunctions from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");
await promisifiedFunctions.run(
  database,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
);
try {
  const resultProperties = await promisifiedFunctions.run(
    database,
    "INSERT INTO books(title) VALUES($title)",
    {
      $title: null,
    },
  );
  console.log(resultProperties.lastID);
} catch (error) {
  if ("code" in error && error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
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
  if ("code" in error && error.code === "SQLITE_ERROR") {
    console.error(error.message);
  } else {
    throw error;
  }
}
await promisifiedFunctions.run(database, "DROP TABLE books");
await promisifiedFunctions.close(database);
