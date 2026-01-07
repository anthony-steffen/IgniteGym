import { Sequelize } from "sequelize";

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

    // Adicione isso logo após a conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('🟢 [DEBUG] Conexão ativa. Testando consulta...');
    
    // Testa uma consulta simples
    const result = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('✅ [DEBUG] Banco respondeu:', result[0]);
  } catch (error) {
    console.error('🔴 [DEBUG] FALHA CRÍTICA NO BANCO:', error);
  }
}
testConnection();
