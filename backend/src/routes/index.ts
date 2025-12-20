import { Router } from "express";
import usersRoutes from "./users.routes";

const routes = Router();

// health check (OBRIGATÓRIO para Railway)
routes.get("/health", (_, res) => {
  return res.status(200).json({ status: "ok" });
});

// suas rotas reais
routes.use("/users", usersRoutes);

export default routes;
