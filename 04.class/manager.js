import enquirer from "enquirer";
import sqlite3 from "sqlite3";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

class Manager {
  constructor() {
    this.database = new sqlite3.Database("sqlite3");
  }

  async createTable() {
    await promisifiedDatabaseFunctions.run(
      this.database,
      "CREATE TABLE IF NOT EXISTS memos(id INTEGER PRIMARY KEY AUTOINCREMENT,content NOT NULL)",
    );
  }

  async add(content) {
    await promisifiedDatabaseFunctions.run(
      this.database,
      "INSERT INTO memos(content) values($content)",
      {
        $content: content,
      },
    );
    await promisifiedDatabaseFunctions.close(this.database);
  }

  async showList() {
    const memos = await this.#fetchAllMemos();
    memos.forEach((memo) => {
      console.log(memo.title);
    });
  }

  async refer() {
    const memos = await this.#fetchAllMemos();
    await promisifiedDatabaseFunctions.close(this.database);
    if (memos.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(memos);
    const question = {
      type: "select",
      name: "memo",
      message: "Choose a note you want to see:",
      choices: choices,
      footer() {
        return memos[this.index].content;
      },
      result() {
        return this.focused.value;
      },
    };

    try {
      const answer = await enquirer.prompt(question);
      console.log(`${answer.memo.content}`);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
  }

  async delete() {
    const memos = await this.#fetchAllMemos();
    if (memos.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(memos);

    const question = {
      type: "select",
      name: "memo",
      message: "Choose a note you want to see:",
      choices: choices,
      footer() {
        return memos[this.index].content;
      },
      result() {
        return this.focused.value;
      },
    };

    try {
      const answer = await enquirer.prompt(question);
      await promisifiedDatabaseFunctions.run(
        this.database,
        "DELETE FROM memos WHERE id = $id",
        { $id: answer.memo.id },
      );
      await promisifiedDatabaseFunctions.close(this.database);
      console.log(`${answer.memo.content} is deleted.`);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
  }

  async #fetchAllMemos() {
    const memos = await promisifiedDatabaseFunctions.all(
      this.database,
      "SELECT id, content FROM memos",
    );
    return memos;
  }

  #prepareChoices(memos) {
    return memos.map((memo) => {
      let memoTitle = memo.content.split("\n")[0];
      return {
        name: memoTitle,
        value: memo,
        message: memoTitle,
      };
    });
  }
}
export default Manager;
