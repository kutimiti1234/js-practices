#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

const database = new sqlite3.Database(":memory:");
await promisifiedDatabaseFunctions.run(
  database,
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
);
try {
  const result = await promisifiedDatabaseFunctions.run(
    database,
    "INSERT INTO books(title) VALUES($title)",
    {
      $title: null,
    },
  );
  console.log(result.lastID);
} catch (error) {
  if ("code" in error && error.code === "SQLITE_CONSTRAINT") {
    console.error(error.message);
  } else {
    throw error;
  }
}
try {
  const row = await promisifiedDatabaseFunctions.get(
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
await promisifiedDatabaseFunctions.run(database, "DROP TABLE books");
await promisifiedDatabaseFunctions.close(database);
