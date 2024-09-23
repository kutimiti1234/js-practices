#! /usr/bin/env node

import sqlite3 from "sqlite3";
import mysqlite3 from "./promisified-functions.js";

const database = new sqlite3.Database(":memory:");

mysqlite3
  .promisifiedRun(
    database,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT,title UNIQUE NOT NULL)",
  )
  .then(() =>
    mysqlite3.promisifiedRun(
      database,
      "INSERT INTO books(title) VALUES($title) ",
      {
        $title: null,
      },
    ),
  )
  .catch((error) => console.log(error.message))
  .then(() =>
    mysqlite3.promisifiedGet(
      database,
      "SELECT error FROM books WHERE id = $id",
      {
        $id: 1,
      },
    ),
  )
  .catch((error) => console.log(error.message))
  .then(() => mysqlite3.promisifiedRun(database, "DROP TABLE books"))
  .then(() => database.close);
