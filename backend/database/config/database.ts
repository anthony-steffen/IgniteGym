// src/database/config/database.ts
import dotenv from "dotenv";
import { Options } from "sequelize";

dotenv.config();

const { DB_USER, DB_PASS, DB_NAME, DB_HOST } = process.env;

const baseConfig: Options = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
};

// 🔥 Exportação compatível com Sequelize CLI (OBRIGATÓRIO)
module.exports = {
  development: baseConfig,
  production: baseConfig,
  test: baseConfig,
};

// 🔥 Exportação opcional para TypeScript (aplicação)
export default baseConfig;
