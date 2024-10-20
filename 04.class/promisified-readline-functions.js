import readline from "readline";

function inputMemoContent() {
  return new Promise((resolve, reject) => {
    try {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const lines = [];
      rl.on("line", (line) => {
        lines.push(line);
      });
      rl.on("SIGINT", () => {
        process.exit(130);
      });
      rl.on("close", async () => {
        resolve(lines.join("\n"));
      });
    } catch (err) {
      reject(err);
    }
  });
}

export default { inputMemoContent };
