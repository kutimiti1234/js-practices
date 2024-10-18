function run(database, sql, param) {
  return new Promise((resolve, reject) => {
    database.run(sql, param, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
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

function all(database, sql, param) {
  return new Promise((resolve, reject) => {
    database.all(sql, param, (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });
  });
}

function close(database) {
  return new Promise((resolve, reject) => {
    database.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
export default { run, get, all, close };
