import readline from "readline";
import enquirer from "enquirer";
import MemoDatabase from "./memo-database.js";

export default class MemoManager {
  #database;

  constructor() {
    this.#database = new MemoDatabase();
  }

  async initializeDatabase() {
    await this.#database.createTable();
  }

  async finalizeDatabase() {
    await this.#database.close();
  }

  async add() {
    let lines;
    try {
      lines = await this.#inputLines();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        process.exit(1);
      } else {
        throw error;
      }
    }

    const content = lines.join("\n");
    await this.#database.insert(content);
  }

  async showList() {
    const memos = await this.#database.selectAll();
    memos.forEach((memo) => {
      console.log(memo.content.split("\n")[0]);
    });
  }

  async refer() {
    const memos = await this.#database.selectAll();

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

    let answer;
    try {
      answer = await enquirer.prompt(question);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
    console.log(answer.memo.content);
  }

  async delete() {
    const memos = await this.#database.selectAll();

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

    let answer;
    try {
      answer = await enquirer.prompt(question);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
    await this.#database.delete(answer.memo.id);

    console.log(`${answer.memo.content} is deleted.`);
  }

  #inputLines() {
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
        if (lines[0] === undefined) {
          reject(new Error("Please enter a memo."));
        }
        resolve(lines);
      });
    });
  }

  #prepareChoices(memos) {
    return memos.map((memo) => {
      const memoPreview =
        memo.content.split("\n")[0] === ""
          ? "No title"
          : memo.content.split("\n")[0];

      return {
        name: memoPreview,
        value: memo,
      };
    });
  }
}
