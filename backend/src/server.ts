import "./config/env"; // 🚨 PRIMEIRA LINHA
import app from "./app";
import { connectDatabase } from "./database";
import { runMigrations } from "./database/runMigrations";

async function bootstrap() {
  console.log("🚀 Iniciando aplicação");
  console.log("🌍 DATABASE_URL:", process.env.DATABASE_URL);

  await connectDatabase();
  await runMigrations();

  const port = process.env.PORT || 3001;
  app.listen(port, () =>
    console.log(`🚀 Servidor rodando na porta ${port}`)
  );
}

bootstrap().catch(err => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
