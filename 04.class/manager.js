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

export default Manager;
