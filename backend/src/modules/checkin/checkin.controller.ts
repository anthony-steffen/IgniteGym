// src/modules/checkin/checkin.controller.ts
import { Request, Response } from 'express';
import { CheckInService } from './checkin.service';
import { getTenantId } from '../../utils/getTenantId';

export class CheckInController {
  static async create(req: Request, res: Response) {
    const tenantId = getTenantId(req);
    const { studentId } = req.body
    const checkIn = await CheckInService.create(tenantId, studentId);
    return res.status(201).json(checkIn);
  }

  static async listByStudent(req: Request, res: Response) {
    const { studentId } = req.body;
    const tenantId = getTenantId(req);
    const checkIns = await CheckInService.listByStudent(tenantId, studentId);
    return res.json(checkIns);
  }
}
