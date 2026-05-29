import { Request, Response } from 'express';
import { SalesService } from './sales.service';
import { AppError } from '../../errors/AppError';

const salesService = new SalesService();

export class SalesController {
  async create(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string;
      const employeeUserId = req.user.id;
      const { studentId, items, paymentMethod } = req.body;

      const sale = await salesService.createSale({
        tenantId,
        studentId,
        employeeUserId,
        items,
        paymentMethod,
      });

      return res.status(201).json(sale);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Erro ao processar a venda.',
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string;
      const sales = await salesService.listSales(tenantId);
      return res.json(sales);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Erro ao listar vendas.',
      });
    }
  }
}
