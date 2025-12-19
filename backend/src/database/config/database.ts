import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida");
}

const baseConfig = {
  url: process.env.DATABASE_URL,
  dialect: "mysql",
  logging: false,
};

// ⚠️ Sequelize CLI exige este formato
module.exports = {
  development: baseConfig,
  production: baseConfig,
  test: baseConfig,
};

// para uso interno da app
export default baseConfig;
