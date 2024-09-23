function run(database, sql, param) {
  return new Promise((resolve, reject) => {
    database.run(sql, param, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function get(database, sql, param) {
  return new Promise((resolve, reject) => {
    database.get(sql, param, (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

export default { run, get };
