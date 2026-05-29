import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { AppError } from '../../errors/AppError';

const dashboardService = new DashboardService();

export class DashboardController {
  static async show(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string;
      const dashboard = await dashboardService.getTenantDashboard(tenantId);
      return res.json(dashboard);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Erro ao carregar dashboard.',
      });
    }
  }
}
