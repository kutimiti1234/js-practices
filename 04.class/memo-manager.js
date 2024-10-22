import enquirer from "enquirer";
import MemoDatabase from "./memo-database.js";
import promisifiedinputhelper from "./promisified-input-helper.js";

class MemoManager {
  #database;
  constructor() {
    this.#database = new MemoDatabase();
  }

  async createTable() {
    await this.#database.createTable();
  }

  async add() {
    const lines = await promisifiedinputhelper.inputLines();
    if (lines[0] === undefined) {
      lines[0] = "No title";
    }
    const content = lines.join("\n");
    await this.#database.insert(content);
    await this.#database.close();
  }

  async showList() {
    const memos = await this.#database.fetchAllMemos();
    memos
      .map((memo) => memo.content.split("\n")[0])
      .forEach((title) => {
        console.log(title);
      });
  }

  async refer() {
    const memos = await this.#database.fetchAllMemos();
    await this.#database.close();
    if (memos.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(memos);
    const question = {
      type: "select",
      name: "memo",
      message: "Choose a memo you want to see:",
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
    const memos = await this.#database.fetchAllMemos();
    if (memos.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(memos);

    const question = {
      type: "select",
      name: "memo",
      message: "Choose a memo you want to see:",
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
export default MemoManager;
