import { Request, Response } from 'express';
import { CheckinService } from './checkin.service';
import { AppError } from '../../errors/AppError';

export class CheckinController {
  private service: CheckinService;

  constructor() {
    this.service = new CheckinService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { studentId } = req.body;

      const checkin = await this.service.create(studentId, tenantId);
      return res.status(201).json(checkin);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const checkins = await this.service.list(tenantId);
      return res.json(checkins);
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  };

  listByStudent = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const tenantId = req.tenantId as string;
      
      const checkins = await this.service.listByStudent(studentId, tenantId);
      return res.json(checkins);
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  };
}