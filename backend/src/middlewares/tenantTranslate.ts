import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../database/models/tenant.model';

export async function tenantTranslate(req: Request, res: Response, next: NextFunction, slug: string) {
  const tenant = await Tenant.findOne({ where: { slug } });

  if (!tenant) {
    return res.status(404).json({ message: 'Academia nao encontrada.' });
  }

  // Apenas ADMIN global (sem tenantId) pode circular entre unidades.
  const isSuperAdmin = req.user?.role === 'ADMIN' && !req.user?.tenantId;
  const isSameTenant = req.user?.tenantId === tenant.id;

  if (!isSuperAdmin && !isSameTenant) {
    return res.status(403).json({ message: 'Acesso negado a esta unidade.' });
  }

  req.tenantId = tenant.id;
  next();
}
