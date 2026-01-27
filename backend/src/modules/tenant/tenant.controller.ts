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
}