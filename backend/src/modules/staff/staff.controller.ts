import { Request, Response } from 'express';
import { StaffService } from './staff.service';

export class StaffController {
  static async create(req: Request, res: Response) {
    const staff = await StaffService.create({
      ...req.body,
      tenantId: req.user!.tenantId,
    });

    res.status(201).json(staff);
  }

  static async list(req: Request, res: Response) {
    const staff = await StaffService.list(req.user!.tenantId);
    res.json(staff);
  }

  static async findOne(req: Request, res: Response) {
    const staff = await StaffService.findOne(req.params.id);
    res.json(staff);
  }

  static async update(req: Request, res: Response) {
    const staff = await StaffService.update(req.params.id, req.body);
    res.json(staff);
  }

  static async deactivate(req: Request, res: Response) {
    await StaffService.deactivate(req.params.id);
    res.status(204).send();
  }
}
