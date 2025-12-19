import { sequelize } from "./sequelize";

export async function connectDatabase(
  retries = 10,
  delay = 3000
): Promise<void> {
  console.log("🔌 Conectando ao banco...");

  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("🟢 Banco conectado com sucesso!");
      return;
    } catch (err) {
      console.log(`🔁 Tentativa ${i}/${retries} falhou`);
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
