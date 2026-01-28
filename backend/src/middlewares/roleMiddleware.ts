import { Request, Response, NextFunction } from "express";

type Role = "ADMIN" | "MANAGER" | "STAFF" | "STUDENT";

export function roleMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Acesso negado: permissão insuficiente",
      });
    }

    return next();
  };
}