import { Sequelize } from "sequelize";
import initUserModel, { UserModel } from "./models/user";
// futuramente:
// import initTenantModel, { TenantModel } from "./models/Tenant";

if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  throw new Error("❌ Configuração de banco não definida");
}

/**
 * Instância única do Sequelize
 * - Railway → DATABASE_URL
 * - Local / Docker → variáveis separadas
 */
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

/**
 * Inicialização dos models
 * ⚠️ ORDEM IMPORTA quando houver associações
 */
initUserModel(sequelize);
// initTenantModel(sequelize);

/**
 * Export explícito dos models tipados
 * (ESSENCIAL para AuthService, middlewares, services)
 */
export {
  UserModel,
  // TenantModel,
};
