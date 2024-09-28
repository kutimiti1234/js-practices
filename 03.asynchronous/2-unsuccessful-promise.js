#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

const database = new sqlite3.Database(":memory:");

promisifiedDatabaseFunctions
  .run(
    database,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  )
  .then(() =>
    promisifiedDatabaseFunctions.run(
      database,
      "INSERT INTO books(title) VALUES($title)",
      {
        $title: null,
      },
    ),
  )
  .catch((error) => {
    if ("code" in error && error.code === "SQLITE_CONSTRAINT") {
      console.error(error.message);
    } else {
      throw error;
    }
    return promisifiedDatabaseFunctions.get(
      database,
      "SELECT error FROM books WHERE id = $id",
      {
        $id: 1,
      },
    );
  })
  .catch((error) => {
    if ("code" in error && error.code === "SQLITE_ERROR") {
      console.error(error.message);
    } else {
      throw error;
    }
    return promisifiedDatabaseFunctions.run(database, "DROP TABLE books");
  })
  .then(() => {
    return promisifiedDatabaseFunctions.close(database);
  });
