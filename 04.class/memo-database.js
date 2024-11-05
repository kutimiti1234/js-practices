import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

export default class MemoDatabase {
  #database;

  constructor() {
    this.#database = new sqlite3.Database("memoDB");
  }

  async createTable() {
    await promisifiedDatabaseFunctions.run(
      this.#database,
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT, content NOT NULL)",
    );
  }

  async insert(content) {
    await promisifiedDatabaseFunctions.run(
      this.#database,
      "INSERT INTO memos(content) VALUES($content)",
      {
        $content: content,
      },
    );
  }

  async selectAll() {
    return await promisifiedDatabaseFunctions.all(
      this.#database,
      "SELECT id, content FROM memos",
    );
  }

  async delete(id) {
    await promisifiedDatabaseFunctions.run(
      this.#database,
      "DELETE FROM memos WHERE id = $id",
      { $id: id },
    );
  }

  async close() {
    await promisifiedDatabaseFunctions.close(this.#database);
  }
}
