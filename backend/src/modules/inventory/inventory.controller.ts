import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';
import { AppError } from '../../errors/AppError';

const inventoryService = new InventoryService();

function getStatusCode(error: unknown) {
  return error instanceof AppError ? error.statusCode : 500;
}

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Erro interno do servidor.';
}

export class InventoryController {
  listProducts = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const products = await inventoryService.listProducts(tenantId);
      return res.json(products);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const product = await inventoryService.createProduct({
        ...req.body,
        tenantId,
      });
      return res.status(201).json(product);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id: productId } = req.params;

      const product = await inventoryService.updateProduct({
        ...req.body,
        tenantId,
        productId,
      });
      return res.json(product);
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id: productId } = req.params;

      await inventoryService.removeProduct(tenantId, productId);
      return res.status(204).send();
    } catch (error) {
      return res.status(getStatusCode(error)).json({ message: getMessage(error) });
    }
  };
}
