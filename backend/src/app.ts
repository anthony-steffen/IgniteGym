import "express-async-errors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";

import { AppError } from "./errors/AppError";

const app = express();

app.use(cors());
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

  // Se for um erro de validação do Sequelize ou erro de sintaxe
  console.error("❌ Erro inesperado:", err);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
});

export default app;
