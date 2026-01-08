import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  listProducts = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const products = await inventoryService.listProducts(tenantId);
    return res.json(products);
  };

  createProduct = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const product = await inventoryService.createProduct({
      ...req.body,
      tenantId
    });
    return res.status(201).json(product);
  };

  updateProduct = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const { id: productId } = req.params;

    const product = await inventoryService.updateProduct({
      ...req.body,
      tenantId,
      productId
    });

    return res.json(product);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const { tenantId } = req.user!;
    const { id: productId } = req.params;

    await inventoryService.removeProduct(tenantId, productId);
    return res.status(204).send();
  };
}