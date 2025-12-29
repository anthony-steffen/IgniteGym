import { Request, Response } from 'express';
import { SalesService } from './sales.service';

const salesService = new SalesService();

export class SalesController {
  async create(req: Request, res: Response) {
    const { tenantId } = req.params;
    // Assume que o employeeId vem do token de autenticação (req.user.id)
    // Para o teste inicial, podemos enviar no body ou params
    const { studentId, employeeId, items, paymentMethod } = req.body;

    const sale = await salesService.createSale({
      tenantId,
      studentId,
      employeeId,
      items,
      paymentMethod,
    });

    return res.status(201).json(sale);
  }

  async list(req: Request, res: Response) {
    const { tenantId } = req.params;
    // Implementação básica de listagem
    const { Sale } = require('../../database/models/sale.model');
    const sales = await Sale.findAll({
      where: { tenant_id: tenantId },
      include: ['items'],
      order: [['created_at', 'DESC']],
    });
    return res.json(sales);
  }
}