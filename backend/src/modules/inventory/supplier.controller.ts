import { Request, Response } from 'express';
import { SupplierService } from './supplier.service';

const supplierService = new SupplierService();

export class SupplierController {
  listSuppliers = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const filters = req.query;
    const suppliers = await supplierService.listSuppliers(tenantId, filters);
    return res.json(suppliers);
  };

  createSupplier = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const supplier = await supplierService.createSupplier({
      ...req.body,
      tenantId
    });
    return res.status(201).json(supplier);
  };

  updateSupplier = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const { id } = req.params;

    const supplier = await supplierService.updateSupplier({
      ...req.body,
      tenantId,
      id
    });

    return res.json(supplier);
  };

  deleteSupplier = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const { id } = req.params;

    await supplierService.removeSupplier(tenantId, id);
    return res.status(204).send();
  };
}