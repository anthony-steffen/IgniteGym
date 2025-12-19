import { Sequelize } from "sequelize";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida");
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

export async function connectDatabase() {
  console.log("🔌 Conectando ao banco...");
  await sequelize.authenticate();
  console.log("🟢 Banco conectado com sucesso!");
}
