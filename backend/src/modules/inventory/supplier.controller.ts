import { Request, Response } from 'express';
import { SupplierService } from './supplier.service';

const supplierService = new SupplierService();

export class SupplierController {
  listSuppliers = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const suppliers = await supplierService.listSuppliers(tenantId, req.query);
      return res.json(suppliers);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  createSupplier = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const supplier = await supplierService.createSupplier({
        ...req.body,
        tenantId
      });
      return res.status(201).json(supplier);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateSupplier = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      const supplier = await supplierService.updateSupplier({
        ...req.body,
        tenantId,
        id
      });
      return res.json(supplier);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteSupplier = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      await supplierService.removeSupplier(tenantId, id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
}