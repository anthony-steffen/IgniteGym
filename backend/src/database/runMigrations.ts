import { exec } from "child_process";

export function runMigrations(): Promise<void> {
  if (process.env.RUN_MIGRATIONS !== "true") {
    console.log("⏭️ Migrations desativadas");
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    console.log("📦 Rodando migrations...");

    exec("npx sequelize-cli db:migrate", (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve();
    });
  });
}
