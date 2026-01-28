// src/modules/checkin/checkin.controller.ts
import { Request, Response } from 'express';
import { CheckInService } from './checkin.service';
import { getTenantId } from '../../utils/getTenantId';

export class CheckInController {
  private service: CheckInService;

  constructor() {
    this.service = new CheckInService();
  }

  async create(req: Request, res: Response) {
    // Tenta pegar o ID do token ou do body (caso seja Super-Admin)
    const tenantId = getTenantId(req) || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ 
        message: 'Tenant ID é obrigatório para realizar check-in.' 
      });
    }

    const { studentId } = req.body;
    
    // Usamos 'as string' pois garantimos a existência acima
    const checkIn = await this.service.create(tenantId as string, studentId);
    return res.status(201).json(checkIn);
  }

  async listByStudent(req: Request, res: Response) {
    const { studentId } = req.params; // Geralmente studentId vem da URL (params) e não do body em GETs
    const tenantId = getTenantId(req) || (req.query.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ 
        message: 'Tenant ID não identificado.' 
      });
    }

    const checkIns = await this.service.listByStudent(tenantId as string, studentId);
    return res.json(checkIns);
  }
}