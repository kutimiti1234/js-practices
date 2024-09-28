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
        $title: "test_book",
      },
    ),
  )
  .then((result) => {
    console.log(result.lastID);
    return promisifiedDatabaseFunctions.get(
      database,
      "SELECT * FROM books WHERE id = $id",
      {
        $id: 1,
      },
    );
  })
  .then((row) => {
    console.log(row.title);
    return promisifiedDatabaseFunctions.run(database, "DROP TABLE books");
  })
  .then(() => {
    return promisifiedDatabaseFunctions.close(database);
  });
