import { Router } from "express";

const usersRoutes = Router();

usersRoutes.get("/", async (_, res) => {
  return res.json({
    message: "Users endpoint funcionando",
  });
});

export default usersRoutes;
