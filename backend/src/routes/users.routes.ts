import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { tenantMiddleware } from "../middlewares/tenantMiddleware";

const usersRoutes = Router();

usersRoutes.get('/', authMiddleware, (req, res) => {
  return res.json({
    message: 'Rota protegida',
    user: req.user,
  });
});

export default usersRoutes;
