// backend/src/routes/index.ts
import { Router } from "express";
import usersRoutes from "./users.routes";
import sessionsRoutes from "./sessions.routes";

const routes = Router();

// health check (OBRIGATÓRIO para Railway)
routes.get("/health", (_, res) => {
  return res.status(200).json({ status: "ok" });
});

// suas rotas reais
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

export default routes;
