// backend/src/routes/index.ts
import { Router } from "express";
import usersRoutes from "./users.routes";
import authRoutes  from "../modules/auth/auth.routes";
import staffRoutes from "../modules/staff/staff.routes";
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
routes.use("/auth", authRoutes);
routes.use("/staff", staffRoutes);

export default routes;
