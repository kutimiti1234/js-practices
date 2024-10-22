import readline from "readline";
import enquirer from "enquirer";
import MemoDatabase from "./memo-database.js";

class MemoManager {
  #database;
  constructor() {
    this.#database = new MemoDatabase();
  }

  async initializeDatabase() {
    await this.#database.createTable();
  }

  async add() {
    try {
      const lines = await this.#inputLines();

      const content = lines.join("\n");
      await this.#database.insert(content);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }

    await this.#database.close();
  }

  async showList() {
    const memos = await this.#database.selectAllMemos();
    memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  }

  async refer() {
    const memos = await this.#database.selectAllMemos();
    await this.#database.close();
    if (memos.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(memos);
    const question = {
      type: "select",
      name: "memo",
      message: "Choose a memo you want to see:",
      choices,
      footer() {
        return memos[this.index].content;
      },
      result() {
        return this.focused.value;
      },
    };

    try {
      const answer = await enquirer.prompt(question);
      console.log(answer.memo.content);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
  }

  async delete() {
    const memos = await this.#database.selectAllMemos();
    if (memos.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(memos);

    const question = {
      type: "select",
      name: "memo",
      message: "Choose a memo you want to see:",
      choices,
      footer() {
        return memos[this.index].content;
      },
      result() {
        return this.focused.value;
      },
    };

    try {
      const answer = await enquirer.prompt(question);
      await this.#database.delete(answer.memo.id);
      await this.#database.close(this.#database);
      console.log(`${answer.memo.content} is deleted.`);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
  }

  async #inputLines() {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
      });

      const lines = [];

      rl.on("line", (line) => {
        lines.push(line);
      });

      rl.on("SIGINT", () => {
        process.exit(130);
      });

      rl.on("close", () => {
        try {
          if (lines[0] === undefined) {
            throw new Error("メモを入力してください。");
          }
          resolve(lines);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  #prepareChoices(memos) {
    return memos.map((memo) => {
      const memoTitle =
        memo.content.split("\n")[0] === ""
          ? "No title"
          : memo.content.split("\n")[0];
      return {
        name: memoTitle,
        value: memo,
        message: memoTitle,
      };
    });
  }
}
export default MemoManager;
