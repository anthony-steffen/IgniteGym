// src/database/index.ts
import { sequelize } from './sequelize';
import { initModels } from './models';

export async function connectDatabase(
  retries = 10,
  delay = 3000
): Promise<void> {
  console.log('🔌 Conectando ao banco...');

  for (let i = 1; i <= retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('🟢 Banco conectado com sucesso!');

      // 🔑 REGRA DE OURO:
      // associações SÓ depois de autenticar
      initModels(sequelize);

      console.log('🧩 Models e associações inicializados!');
      return;
    } catch (err) {
      console.log(`🔁 Tentativa ${i}/${retries} falhou`);
      if (i === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
