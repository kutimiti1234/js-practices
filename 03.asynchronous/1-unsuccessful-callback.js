#! /usr/bin/env node

import sqlite3 from "sqlite3";

const database = new sqlite3.Database(":memory:");

database.run(
  "CREATE TABLE books(id INTEGER PRIMARY KEY AUTOINCREMENT, title UNIQUE NOT NULL)",
  () => {
    database.run(
      "INSERT INTO books(title) VALUES($title)",
      {
        $title: null,
      },
      function (error) {
        if (error) {
          console.error(error.message);
        }
        database.get(
          "SELECT error FROM books WHERE id = $id",
          {
            $id: 1,
          },
          (error) => {
            if (error) {
              console.error(error.message);
            }
            database.run("DROP TABLE books", () => {
              database.close();
            });
          },
        );
      },
    );
  },
);
