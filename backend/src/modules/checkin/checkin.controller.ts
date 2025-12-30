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
    const tenantId = getTenantId(req);
    const { studentId } = req.body
    const checkIn = await this.service.create(tenantId, studentId);
    return res.status(201).json(checkIn);
  }

  async listByStudent(req: Request, res: Response) {
    const { studentId } = req.body;
    const tenantId = getTenantId(req);
    const checkIns = await this.service.listByStudent(tenantId, studentId);
    return res.json(checkIns);
  }
}
