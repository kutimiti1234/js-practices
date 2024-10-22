import readline from "readline";

function inputLines() {
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
      try {
        if (lines[0] === undefined) {
          throw new Error("メモを入力してください。");
        }
        resolve(lines);
      } catch (err) {
        reject(err);
      }
    });
  });
}

export default { inputLines };
