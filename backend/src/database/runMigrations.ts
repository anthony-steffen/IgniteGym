import { sequelize } from "./sequelize";

export async function runMigrations() {
  if (process.env.RUN_MIGRATIONS !== "true") {
    console.log("⏭️ RUN_MIGRATIONS=false — pulando migrations");
    return;
  }

  console.log("📦 Rodando migrations via Sequelize");

  await sequelize.sync({ alter: false }); 
  // ⬆️ usa suas models
  // ⬆️ cria tabelas se não existirem

  console.log("✅ Migrations aplicadas");
}
