import { Request, Response } from 'express';
import { InventoryService } from './inventory.service';

const inventoryService = new InventoryService();

export class InventoryController {
  listProducts = async (req: Request, res: Response) => {
    // Busca do token ou da query (para Super-Admin)
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Tenant não identificado.' });
    }

    // Passamos o tenantId (as string para satisfazer o service)
    const products = await inventoryService.listProducts(tenantId as string);
    console.log(products);
    return res.json(products);
  };

  createProduct = async (req: Request, res: Response) => {
    // Busca do token ou do body
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ 
        message: 'É necessário informar um tenantId para cadastrar um produto.' 
      });
    }

    const product = await inventoryService.createProduct({
      ...req.body,
      tenantId: tenantId as string
    });
    return res.status(201).json(product);
  };

  updateProduct = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);
    const { id: productId } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'TenantId não identificado.' });
    }

    const product = await inventoryService.updateProduct({
      ...req.body,
      tenantId: tenantId as string,
      productId
    });

    return res.json(product);
  };

  deleteProduct = async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);
    const { id: productId } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'TenantId não identificado.' });
    }

    await inventoryService.removeProduct(tenantId as string, productId);
    return res.status(204).send();
  };
}