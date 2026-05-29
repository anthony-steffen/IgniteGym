import { Request, Response } from 'express';
import { SupplierService } from './supplier.service';
import { AppError } from '../../errors/AppError';

const supplierService = new SupplierService();

function getStatusCode(error: unknown) {
  return error instanceof AppError ? error.statusCode : 500;
}

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Erro interno do servidor.';
}

export class SupplierController {
  listSuppliers = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const suppliers = await supplierService.listSuppliers(tenantId, req.query);
      return res.json(suppliers);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  createSupplier = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const supplier = await supplierService.createSupplier({
        ...req.body,
        tenantId,
      });
      return res.status(201).json(supplier);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  updateSupplier = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      const supplier = await supplierService.updateSupplier({
        ...req.body,
        tenantId,
        id,
      });
      return res.json(supplier);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  deleteSupplier = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id } = req.params;

      await supplierService.removeSupplier(tenantId, id);
      return res.status(204).send();
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };
}
