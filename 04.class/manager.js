import enquirer from "enquirer";
import promisifiedDatabaseFunctions from "./promisified-database-functions.js";
class Manager {
  constructor(database) {
    this.database = database;
  }

  async add(title, body) {
    await promisifiedDatabaseFunctions.run(
      this.database,
      "INSERT INTO memo(title,body) values($title,$body)",
      {
        $title: title,
        $body: body,
      },
    );
    await promisifiedDatabaseFunctions.close(this.database);
  }
  async showList() {
    const result = await promisifiedDatabaseFunctions.all(
      this.database,
      "SELECT title FROM memo",
    );
    result.forEach((result) => {
      console.log(result.title);
    });
  }
  async refer() {
    const notes = await promisifiedDatabaseFunctions.all(
      this.database,
      "SELECT title , body  FROM memo",
    );
    const question = {
      type: "select",
      name: "note",
      message: "Choose a note you want to see:",
      footer() {
        return notes[this.index].body;
      },
      choices: notes.map((note) => {
        return { name: note.title, message: note.title, value: note };
      }),
      result() {
        return this.focused.value;
      },
    };

    let answer = await enquirer.prompt(question);
    console.log(`${answer.note.title}\n${answer.note.body}`);
  }

  async delete() {
    const notes = await promisifiedDatabaseFunctions.all(
      this.database,
      "SELECT id, title, body FROM memo",
    );
    if (notes.length > 0) {
      const choices = notes.map((note) => ({
        name: note.title,
        value: note,
        message: note.title,
      }));

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
      await promisifiedDatabaseFunctions.run(
        this.database,
        "DELETE FROM memo WHERE id = $id",
        { $id: answer.note.id },
      );
      console.log(`${answer.note.title} is deleated.`);
    }
  }
}
export default Manager;
