import { Request, Response } from 'express';
import { StaffService } from './staff.service';
import { AppError } from '../../errors/AppError';

export class StaffController {
  static async create(req: Request, res: Response) {
    // 1️⃣ No registro, o tenantId deve vir do body (enviado pelo front)
    // ou ser injetado por uma lógica de criação de nova academia.
    const { tenantId, ...rest } = req.body;

    if (!tenantId) {
      throw new AppError('O ID da academia (tenantId) é obrigatório para o registro.', 400);
    }

    const staff = await StaffService.create({
      ...rest,
      tenantId: tenantId, 
    });

    res.status(201).json(staff);
  }

  static async list(req: Request, res: Response) {
    // Aqui o req.user está correto, pois a listagem EXIGE login (conforme suas rotas)
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
