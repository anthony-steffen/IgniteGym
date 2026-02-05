import { Request, Response } from 'express';
import { SalesService } from './sales.service';

const salesService = new SalesService();

export class SalesController {
  async create(req: Request, res: Response) {
    try {
      // tenantId resolvido pelo middleware via slug
      const tenantId = req.tenantId as string;
      
      // employeeId extraído com segurança do Token JWT
      const employeeId = req.user.id; 
      
      const { studentId, items, paymentMethod } = req.body;

      const sale = await salesService.createSale({
        tenantId,
        studentId,
        employeeId,
        items,
        paymentMethod,
      });

      return res.status(201).json(sale);
    } catch (error: any) {
      return res.status(500).json({ 
        status: "error", 
        message: error.message || "Erro ao processar a venda." 
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string;

      // Importação dinâmica do modelo (mantendo seu padrão)
      const { Sale } = require('../../database/models/sale.model');
      
      const sales = await Sale.findAll({
        where: { tenant_id: tenantId },
        include: ['items'],
        order: [['created_at', 'DESC']],
      });

      return res.json(sales);
    } catch (error: any) {
      return res.status(500).json({ 
        status: "error", 
        message: error.message || "Erro ao listar vendas." 
      });
    }
  }
}