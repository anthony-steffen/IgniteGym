import app from "./app";
import { connectDatabase } from "./database";
import { runMigrations } from "./database/runMigrations";

async function bootstrap() {
  console.log("🚀 Iniciando aplicação");

  await connectDatabase();
  await runMigrations();

  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`🚀 Servidor rodando na porta ${port}`)
  );
}

bootstrap().catch((err) => {
  console.error("❌ Erro fatal:", err);
  process.exit(1);
});
