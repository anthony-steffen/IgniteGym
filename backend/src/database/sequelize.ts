import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// 1. Carrega as variáveis de ambiente antes de qualquer lógica
dotenv.config();

// 2. Determina o modo de operação
const isProduction = process.env.NODE_ENV === "production" || !!process.env.DATABASE_URL;

// 3. Configuração da instância
export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "mysql",
      logging: false,
      dialectOptions: isProduction ? {
        ssl: {
          rejectUnauthorized: false,
        },
      } : {},
    })
  : new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASS as string,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: isProduction ? false : console.log,
        // Garante que o Sequelize não tente conectar antes do banco estar pronto no Docker
        retry: {
          max: 10
        }
      }
    );

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`🟢 [DATABASE] Conectado em modo: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
    console.log(`📍 Host: ${process.env.DB_HOST}`);
  } catch (error) {
    console.error('🔴 [DATABASE] Erro de conexão detalhado:');
    if (error instanceof Error) {
      console.error(`Mensagem: ${error.message}`);
    }
  }
}

testConnection();