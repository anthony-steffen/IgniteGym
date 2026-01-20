// backend/src/server.ts
import dotenv from "dotenv";
import path from "path";

// 1. Configuração Robusta de Variáveis de Ambiente
// Identifica se está no Docker, Railway (Produção) ou Local
const envFile = process.env.DOCKER === 'true' 
  ? '.env.docker' 
  : (process.env.NODE_ENV === 'production' ? '.env.railway' : '.env');

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import app from "./app";
import { sequelize } from "./database/sequelize"; // Importa a instância corrigida do Sequelize
import { startSubscriptionExpirationJob } from "./jobs/subscription-expiration.job";

async function bootstrap() {
  console.log(`🚀 Iniciando aplicação em modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Carregando configurações de: ${envFile}`);

  try {
    // 2. Tenta conectar ao banco de dados usando a instância configurada
    await sequelize.authenticate();
    console.log("✅ [DATABASE] Conexão estabelecida com sucesso.");

    // 3. Inicia tarefas em segundo plano
    startSubscriptionExpirationJob();

    // 4. Configuração da Porta
    // No Railway a porta é injetada automaticamente, localmente usa o .env ou 3001
    const port = Number(process.env.PORT || 3001);

    app.listen(port, () =>
      console.log(`🚀 Servidor rodando na porta ${port}`)
    );
  } catch (err) {
    console.error("❌ Erro fatal durante a inicialização:", err);
    process.exit(1);
  }
}

bootstrap();