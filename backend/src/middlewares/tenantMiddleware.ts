import { Request, Response, NextFunction } from 'express';

export function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 🟢 Se for ADMIN, ele tem permissão de "Super User" e não precisa de tenantId
  if (req.user?.role === 'ADMIN') {
    return next();
  }

  // Para as demais roles, o tenantId continua obrigatório
  if (!req.user?.tenantId) {
    return res.status(403).json({ message: 'Tenant não identificado ou acesso negado para esta conta' });
  }

  return next();
}