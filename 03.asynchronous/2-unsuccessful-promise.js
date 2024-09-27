#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctionss from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");

promisifiedDatabaseFunctionss
  .run(
    database,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  )
  .then(() =>
    promisifiedDatabaseFunctionss.run(
      database,
      "INSERT INTO books(title) VALUES($title)",
      {
        $title: null,
      },
    ),
  )
  .catch((error) => {
    console.error(error.message);
    return promisifiedDatabaseFunctionss.get(
      database,
      "SELECT error FROM books WHERE id = $id",
      {
        $id: 1,
      },
    );
  })
  .catch((error) => {
    console.error(error.message);
    return promisifiedDatabaseFunctionss.run(database, "DROP TABLE books");
  })
  .then(() => {
    return promisifiedDatabaseFunctionss.close(database);
  });
