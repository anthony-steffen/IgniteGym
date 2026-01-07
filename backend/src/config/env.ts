import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.railway"
    : process.env.DOCKER
    ? ".env.docker"
    : ".env";

dotenv.config({ path: envFile });

console.log(`🌍 Variáveis carregadas de ${envFile}`);
