#! /usr/bin/env node

import sqlite3 from "sqlite3";
import mysqlite3 from "./promisified_functions.js";

(async () => {
  const database = new sqlite3.Database(":memory:");
  try {
    await mysqlite3.promisifiedRun(
      database,
      "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT,title UNIQUE NOT NULL)",
    );
    let addedID = await mysqlite3.promisifiedRun(
      database,
      "INSERT INTO books(title) VALUES($title) ",
      { $title: "test_book" },
    );
    console.log(addedID);
    let row = await mysqlite3.promisifiedGet(
      database,
      "SELECT * FROM books WHERE id = $id",
      {
        $id: 1,
      },
    );
    console.log(row.title);
    await mysqlite3.promisifiedRun(database, "DROP TABLE books");
  } catch (error) {
    console.log(error.message);
  }
  database.close;
})();
