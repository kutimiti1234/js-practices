#! /usr/bin/env node

import sqlite3 from "sqlite3";
import mysqlite3 from "./promisified_functions.js";

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
        $title: "test_book",
      },
    ),
  )
  .then((result) => console.log(result))
  .then(() =>
    mysqlite3.promisifiedGet(database, "SELECT * FROM books WHERE id = $id", {
      $id: 1,
    }),
  )
  .then((row) => console.log(row.title))
  .then(() => mysqlite3.promisifiedRun(database, "DROP TABLE books"))
  .then(() => database.close);
