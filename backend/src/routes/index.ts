// backend/src/routes/index.ts
import { Router } from "express";
import usersRoutes from "./users.routes";
import authRoutes  from "../modules/auth/auth.routes";
import staffRoutes from "../modules/staff/staff.routes";
import studentsRoutes from "../modules/student/student.routes";
import subscriptionsRoutes from "../modules/subscription/subscription.routes";
import plansRoutes from "../modules/plan/plan.routes";
import checkinRoutes from "../modules/checkin/checkin.routes";
import inventoryRouter  from "../modules/inventory/inventory.routes";
import salesRouter from "../modules/sale/sales.routes";

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
routes.use("/users", usersRoutes, authMiddleware);
routes.use("/auth", authRoutes, authMiddleware);
routes.use("/staff", staffRoutes);
routes.use("/students", studentsRoutes);
routes.use("/subscriptions", subscriptionsRoutes);
routes.use("/plans", plansRoutes);
routes.use("/checkins", checkinRoutes);
routes.use("/inventory", inventoryRouter);
routes.use("/sales", salesRouter);

export default routes;
