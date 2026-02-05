import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../database/models/tenant.model';

export async function tenantTranslate(req: Request, res: Response, next: NextFunction, slug: string) {
  const tenant = await Tenant.findOne({ where: { slug } });

  if (!tenant) {
    return res.status(404).json({ message: 'Academia não encontrada.' });
  }

  // Se o usuário não for ADMIN, verificamos se ele tem permissão para esta unidade
  if (req.user?.role !== 'ADMIN' && req.user?.tenantId !== tenant.id) {
    return res.status(403).json({ message: 'Acesso negado a esta unidade.' });
  }

  // Injetamos o ID real no request para o Controller usar
  req.tenantId = tenant.id; 
  next();
}