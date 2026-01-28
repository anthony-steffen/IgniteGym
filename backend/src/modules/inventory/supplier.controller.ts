import { Request, Response } from 'express';
import { SupplierService } from './supplier.service';

const supplierService = new SupplierService();

export class SupplierController {
  listSuppliers = async (req: Request, res: Response) => {
    // Busca do token ou da query (para Super-Admin)
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Tenant não identificado.' });
    }

    const filters = req.query;
    // Usamos o cast 'as string' após a validação de existência
    const suppliers = await supplierService.listSuppliers(tenantId as string, filters);
    return res.json(suppliers);
  };

  createSupplier = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ 
        message: 'É necessário informar um tenantId para cadastrar um fornecedor.' 
      });
    }

    const supplier = await supplierService.createSupplier({
      ...req.body,
      tenantId: tenantId as string
    });
    return res.status(201).json(supplier);
  };

  updateSupplier = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'TenantId não identificado.' });
    }

    const supplier = await supplierService.updateSupplier({
      ...req.body,
      tenantId: tenantId as string,
      id
    });

    return res.json(supplier);
  };

  deleteSupplier = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'TenantId não identificado.' });
    }

    await supplierService.removeSupplier(tenantId as string, id);
    return res.status(204).send();
  };
}