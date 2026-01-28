import { Request, Response } from 'express';
import { TenantService } from './tenant.service';

export class TenantController {
  static async register(req: Request, res: Response) {
    const result = await TenantService.create(req.body);
    return res.status(201).json(result);
  }

  // Novo: Listar todas as unidades (Uso exclusivo do Super Admin)
  static async list(req: Request, res: Response) {
    const tenants = await TenantService.findAll();
    return res.json(tenants);
  }

  static async show(req: Request, res: Response) {
    // Se for ADMIN e não tiver tenantId no token, ele pode querer ver uma específica via Query Param
    // Se for MANAGER, usamos o tenantId do Token
    const tenantId = req.user.tenantId || (req.query.id as string);

    if (!tenantId) {
      return res.status(400).json({ message: 'ID da unidade é necessário para Admin Global' });
    }

    const tenant = await TenantService.show(tenantId);
    return res.json(tenant);
  }

  static async update(req: Request, res: Response) {
    // Prioriza o ID enviado no body (se for Admin) ou o ID do Token (se for Manager)
    const id = req.user.role === 'ADMIN' ? req.body.id : req.user.tenantId;

    if (!id) return res.status(400).json({ message: 'ID não identificado' });

    const result = await TenantService.update(id, req.body);
    return res.json(result);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await TenantService.delete(id);
    return res.json(result);
  }
}