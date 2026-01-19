import "express-async-errors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";

import { AppError } from "./errors/AppError";

const app = express();

// Configuração dinâmica de CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem "origin" (como ferramentas de mobile ou Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Não permitido pelo CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// healthcheck
app.get("/", (_, res) => res.json({ status: "ok" }));

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("❌ Erro inesperado:", err);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
});

export default app;