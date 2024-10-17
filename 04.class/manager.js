import enquirer from "enquirer";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";

class Manager {
  constructor(database) {
    this.database = database;
  }

  async add(title, body) {
    await promisifiedDatabaseFunctions.run(
      this.database,
      "INSERT INTO memo(title, body) values($title, $body)",
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
    await promisifiedDatabaseFunctions.close(this.database);
  }

  async refer() {
    const notes = await this.#fetchAllNotes();
    if (notes.length > 0) {
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

      let answer = await enquirer.prompt(question);
      console.log(`${answer.note.title}\n${answer.note.body}`);
    }
    await promisifiedDatabaseFunctions.close(this.database);
  }

  async delete() {
    const notes = await this.#fetchAllNotes();
    if (notes.length > 0) {
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

      let answer = await enquirer.prompt(question);
      await promisifiedDatabaseFunctions.run(
        this.database,
        "DELETE FROM memo WHERE id = $id",
        { $id: answer.note.id },
      );
      console.log(`${answer.note.title} is deleated.`);
    }
    await promisifiedDatabaseFunctions.close(this.database);
  }

  async #fetchAllNotes() {
    return await promisifiedDatabaseFunctions.all(
      this.database,
      "SELECT id, title, body FROM memo",
    );
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
