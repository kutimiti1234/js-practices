#! /usr/bin/env node

import sqlite3 from "sqlite3";
import promisifiedFunctions from "./promisified-functions.js";

(async () => {
  const database = new sqlite3.Database(":memory:");
  await promisifiedFunctions.run(
    database,
    "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  );
  try {
    const addedID = await promisifiedFunctions.run(
      database,
      "INSERT INTO books(title) VALUES($title)",
      { $title: null },
    );
    console.log(addedID);
  } catch (error) {
    console.log(error.message);
  }
  try {
    const row = await promisifiedFunctions.get(
      database,
      "SELECT error FROM books WHERE id = $id",
      {
        $id: 1,
      },
    );
    console.log(row.title);
  } catch (error) {
    console.error(error.message);
  }
  await promisifiedFunctions.run(database, "DROP TABLE books");
  database.close;
})();
