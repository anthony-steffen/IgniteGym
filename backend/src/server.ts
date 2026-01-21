// backend/src/server.ts
import dotenv from "dotenv";
import path from "path";

const envFile = process.env.DOCKER === 'true' 
  ? '.env.docker' 
  : (process.env.NODE_ENV === 'production' ? '.env.railway' : '.env');

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import app from "./app";
import { connectDatabase } from "./database"; // 👈 Importe a função que criamos antes
import { startSubscriptionExpirationJob } from "./jobs/subscription-expiration.job";

async function bootstrap() {
  console.log(`🚀 Iniciando aplicação em modo: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    // 1. O PONTO CHAVE: Conecta ao banco E roda o setupAssociations()
    // Esta função que você me mandou no passo anterior já chama o setupAssociations()
    await connectDatabase(); 

    // 2. Inicia tarefas em segundo plano
    startSubscriptionExpirationJob();

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