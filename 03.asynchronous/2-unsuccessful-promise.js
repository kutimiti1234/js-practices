#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedFunctions from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");

promisifiedFunctions
  .run(
    database,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  )
  .then(() =>
    promisifiedFunctions.run(
      database,
      "INSERT INTO books(title) VALUES($title)",
      {
        $title: null,
      },
    ),
  )
  .catch((error) => {
    console.error(error.message);
    return promisifiedFunctions.get(
      database,
      "SELECT error FROM books WHERE id = $id",
      {
        $id: 1,
      },
    );
  })
  .catch((error) => {
    console.error(error.message);
    promisifiedFunctions.run(database, "DROP TABLE books");
  })
  .then(() => database.close);
