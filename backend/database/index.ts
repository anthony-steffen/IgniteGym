import { Sequelize } from "sequelize";
import config from "./config/database";

console.log("\n--------------------------------------------");
console.log("🔌 Tentando conectar ao MySQL...");
console.log(`📡 Host: ${process.env.DB_HOST}`);
console.log("--------------------------------------------\n");

export const sequelize = new Sequelize(config);

sequelize
  .authenticate()
  .then(() => {
    console.log("🟢 Conexão MySQL estabelecida com sucesso!\n");
  })
  .catch((error) => {
    console.error("🔴 Erro ao conectar ao MySQL:", error.message);
  });

export default sequelize;
