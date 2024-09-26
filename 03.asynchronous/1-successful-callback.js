#! /usr/bin/env node

import sqlite3 from "sqlite3";

const database = new sqlite3.Database(":memory:");

database.run(
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  () => {
    database.run(
      "INSERT INTO books(title) VALUES($title)",
      {
        $title: "test_book",
      },
      function () {
        console.log(this.lastID);
        database.get(
          "SELECT * FROM books WHERE id = $id",
          {
            $id: 1,
          },
          (_, row) => {
            console.log(row.title);
            database.run("DROP TABLE books", () => database.close());
          },
        );
      },
    );
  },
);
