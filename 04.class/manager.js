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
}
export default Manager;
