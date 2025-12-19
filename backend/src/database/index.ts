import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL não definida");
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: "mysql",
  logging: false,
});

export async function connectDatabase() {
  console.log("🔌 Conectando ao banco...");
  await sequelize.authenticate();
  console.log("🟢 Banco conectado com sucesso!");
}
