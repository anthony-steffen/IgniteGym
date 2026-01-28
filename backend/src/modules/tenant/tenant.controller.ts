import { Request, Response } from 'express';
import { TenantService } from '../tenant/tenant.service';
export class TenantController {
  static async register(req: Request, res: Response) {
    const { 
      name, 
      slug, 
      address, 
      contact_email, 
      admin_name, 
      admin_email, 
      admin_password 
    } = req.body;

    const result = await TenantService.create({
      name,
      slug,
      address,
      contact_email,
      admin_name,
      admin_email,
      admin_password,
    });

    return res.status(201).json(result);
  }

    static async show(req: Request, res: Response) {
    // Pegamos o tenantId do usuário autenticado (padrão que vi no seu StudentController)
    const { tenantId } = req.user as any; 

    const tenant = await TenantService.show(tenantId);

    return res.json(tenant);
  }

  static async update(req: Request, res: Response) {
  // Pega o ID real do UUID que está no Token, não a string "update" da URL
  const { tenantId } = req.user as any; 

  const result = await TenantService.update(tenantId, req.body);
  return res.json(result);
}

  static async delete(req: Request, res: Response) {
    // Extração direta do objeto injetado pelo authMiddleware
    const { tenantId } = req.user as any;
    
    const result = await TenantService.delete(tenantId);
    return res.json(result);
  }
}