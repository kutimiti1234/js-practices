#! /usr/bin/env node

import sqlite3 from "sqlite3";
import mysqlite3 from "./promisified-functions.js";

(async () => {
  const database = new sqlite3.Database(":memory:");
  try {
    await mysqlite3.promisifiedRun(
      database,
      "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT,title UNIQUE NOT NULL)",
    );
    const addedID = await mysqlite3.promisifiedRun(
      database,
      "INSERT INTO books(title) VALUES($title) ",
      { $title: null },
    );
    console.log(addedID);
  } catch (error) {
    console.log(error.message);
  }
  try {
    const row = await mysqlite3.promisifiedGet(
      database,
      "SELECT error FROM books WHERE id = $id",
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
