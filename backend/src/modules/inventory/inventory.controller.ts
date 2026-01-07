import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  // Arrow functions garantem que o 'this' não se perca e simplificam o uso no Router
  createProduct = async (req: Request, res: Response) => {
    const { tenantId } = req.user; // Extraído do authMiddleware (Token)

    const product = await inventoryService.createProduct({
      ...req.body,
      tenantId
    });

    return res.status(201).json(product);
  }

  updateStock = async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    const { productId } = req.params;

    const movement = await inventoryService.updateStock({
      ...req.body,
      tenantId,
      productId
    });

    return res.json(movement);
  }

  listProducts = async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    
    const products = await inventoryService.listProducts(tenantId);
    
    return res.json(products);
  }
}