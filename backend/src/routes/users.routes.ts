import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  return res.json({
    message: 'Users endpoint funcionando!',
    user: req.user,
  });
});

export default router;
