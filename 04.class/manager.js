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
      "CREATE TABLE IF NOT EXISTS note(id INTEGER PRIMARY KEY AUTOINCREMENT, title NOT NULL, body NOT NULL)",
    );
  }

  async add(title, body) {
    await promisifiedDatabaseFunctions.run(
      this.database,
      "INSERT INTO note(title, body) values($title, $body)",
      {
        $title: title ?? "No title",
        $body: body,
      },
    );
    await promisifiedDatabaseFunctions.close(this.database);
  }

  async showList() {
    const notes = await this.#fetchAllNotes();
    notes.forEach((note) => {
      console.log(note.title);
    });
  }

  async refer() {
    const notes = await this.#fetchAllNotes();
    if (notes.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(notes);

    const question = {
      type: "select",
      name: "note",
      message: "Choose a note you want to see:",
      footer() {
        return notes[this.index].body;
      },
      choices: choices,
      result() {
        return this.focused.value;
      },
    };

    try {
      const answer = await enquirer.prompt(question);
      console.log(`${answer.note.title}\n${answer.note.body}`);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
  }

  async delete() {
    const notes = await this.#fetchAllNotes();
    if (notes.length === 0) {
      return;
    }
    const choices = this.#prepareChoices(notes);

    const question = {
      type: "select",
      name: "note",
      message: "Choose a note you want to delete:",
      footer() {
        return notes[this.index].body;
      },
      choices: choices,
      result() {
        return this.focused.value;
      },
    };

    try {
      const answer = await enquirer.prompt(question);
      await promisifiedDatabaseFunctions.run(
        this.database,
        "DELETE FROM note WHERE id = $id",
        { $id: answer.note.id },
      );
      console.log(`${answer.note.title} is deleated.`);
    } catch (error) {
      if (error === "") {
        process.exit(130);
      } else {
        throw error;
      }
    }
  }

  async #fetchAllNotes() {
    const notes = await promisifiedDatabaseFunctions.all(
      this.database,
      "SELECT id, title, body FROM note",
    );
    await promisifiedDatabaseFunctions.close(this.database);
    return notes;
  }

  #prepareChoices(notes) {
    return notes.map((note) => ({
      name: note.title,
      value: note,
      message: note.title,
    }));
  }
}
export default Manager;
