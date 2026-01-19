import { Sequelize } from "sequelize";

// Verifica se está em produção através do NODE_ENV ou da presença da URL do banco
const isProduction = process.env.NODE_ENV === "production" || !!process.env.DATABASE_URL;

export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      logging: false, // Sempre desligado em produção para performance
      dialectOptions: isProduction ? {
        ssl: {
          rejectUnauthorized: false, // Ativa SSL apenas se estiver em produção
        },
      } : {},
    })
  : new Sequelize(
      process.env.DB_NAME || "ignitegym",
      process.env.DB_USER || "root",
      process.env.DB_PASS || "",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: isProduction ? false : console.log, // Loga consultas apenas em desenvolvimento
      }
    );

// Função de teste de conexão
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`🟢 [DATABASE] Conexão ativa em modo: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
    
    const [result]: any = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('✅ [DATABASE] Teste de consulta:', result[0].result === 2 ? "SUCESSO" : "FALHA");
  } catch (error) {
    console.error('🔴 [DATABASE] Erro de conexão:');
    if (error instanceof Error) {
      console.error(`   Detalhes: ${error.message}`);
    }
  }
}

testConnection();