import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  listProducts = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const products = await inventoryService.listProducts(tenantId);
      return res.json(products);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const product = await inventoryService.createProduct({
        ...req.body,
        tenantId
      });
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id: productId } = req.params;

      const product = await inventoryService.updateProduct({
        ...req.body,
        tenantId,
        productId
      });
      return res.json(product);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id: productId } = req.params;

      await inventoryService.removeProduct(tenantId, productId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
}