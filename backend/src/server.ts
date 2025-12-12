// backend/src/server.ts
import app from "./app";
import dotenv from "dotenv";
import "./database"

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(process.env.PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
});