//backend/src/server.ts
import "./config/env"; // 🚨 PRIMEIRA LINHA
import app from "./app";
import { connectDatabase } from "./database";
import { runMigrations } from "./database/runMigrations";
import { runSeeds } from "./database/runSeeds";

async function bootstrap() {
  console.log("🚀 Iniciando aplicação");
  console.log("🌍 DATABASE_URL:", process.env.DATABASE_URL);

  await connectDatabase();
  await runMigrations();
  await runSeeds();

  const port = Number(process.env.PORT);
  if (!port) {
    throw new Error("❌ PORT não definido");
  }

  app.listen(port, () =>
    console.log(`🚀 Servidor rodando na porta ${port}`)
  );
}

bootstrap().catch(err => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
