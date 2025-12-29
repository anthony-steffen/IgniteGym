import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  async createProduct(req: Request, res: Response) {
    const { tenantId } = req.params; // Ou extraído do token se preferir
    const product = await inventoryService.createProduct({
      ...req.body,
      tenantId
    });
    return res.status(201).json(product);
  }

  async updateStock(req: Request, res: Response) {
    const { tenantId } = req.params;
    const { productId } = req.params;
    const movement = await inventoryService.updateStock({
      ...req.body,
      tenantId,
      productId
    });
    return res.json(movement);
  }

  async listProducts(req: Request, res: Response) {
    const { tenantId } = req.params;
    const products = await inventoryService.listProducts(tenantId);
    return res.json(products);
  }
}