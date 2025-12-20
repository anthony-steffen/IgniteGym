import { Sequelize } from "sequelize";

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  throw new Error("Configuração de banco não definida");
}

export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASS!,
      {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: false,
      }
    );
