// backend/src/routes/index.ts
import { Router } from "express";
import usersRoutes from "./users.routes";
import sessionsRoutes from "./sessions.routes";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const routes = Router();

// health check (OBRIGATÓRIO para Railway)
routes.get("/health", (_, res) => {
  return res.status(200).json({ status: "ok" });
});

// Teste para RoleMiddleware
routes.get(
  "/admin-only",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (_, res) => {
    res.json({ message: "Esse usuário tem permissão de admin" });
  }
);

// suas rotas reais
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

export default routes;
