import { Request, Response, NextFunction } from 'express';

export function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.tenantId) {
    return res.status(403).json({ message: 'Tenant não identificado' });
  }

  return next();
}
