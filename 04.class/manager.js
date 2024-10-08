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

export default Manager;
