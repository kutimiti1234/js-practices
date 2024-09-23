#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedFunctions from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");

promisifiedFunctions
  .promisifiedRun(
    database,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  )
  .then(() =>
    promisifiedFunctions.promisifiedRun(
      database,
      "INSERT INTO books(title) VALUES($title)",
      {
        $title: null,
      },
    ),
  )
  .catch((error) => console.log(error.message))
  .then(() =>
    promisifiedFunctions.promisifiedGet(
      database,
      "SELECT error FROM books WHERE id = $id",
      {
        $id: 1,
      },
    ),
  )
  .catch((error) => console.log(error.message))
  .then(() => promisifiedFunctions.promisifiedRun(database, "DROP TABLE books"))
  .then(() => database.close);
