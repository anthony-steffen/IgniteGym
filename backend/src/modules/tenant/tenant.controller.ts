import { Request, Response } from 'express';
import { TenantService } from './tenant.service';

export class TenantController {
  static async register(req: Request, res: Response) {
    const result = await TenantService.create(req.body);
    return res.status(201).json(result);
  }

  static async list(req: Request, res: Response) {
    const tenants = await TenantService.findAll();
    return res.json(tenants);
  }

  static async show(req: Request, res: Response) {
    const tenantId = req.tenantId; // Injetado pelo tenantTranslate via slug

    if (!tenantId) {
      return res.status(400).json({ message: 'Contexto da unidade não identificado.' });
    }

    const tenant = await TenantService.show(tenantId);
    return res.json(tenant);
  }

  static async update(req: Request, res: Response) {
    const tenantId = req.tenantId; // Injetado pelo tenantTranslate via slug
    const updateData = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: 'Contexto da unidade não identificado.' });
    }

    // Limpeza de dados: impede que o usuário altere campos sensíveis via update comum
    const { id, slug, created_at, ...validData } = updateData;

    const result = await TenantService.update(tenantId, validData);
    return res.json(result);
  }

  static async delete(req: Request, res: Response) {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Contexto da unidade não identificado.' });
    }

    await TenantService.delete(tenantId);
    return res.status(204).send();
  }
}