import { Router } from 'express';
import { InventoryController } from './inventory.controller';

const inventoryRouter = Router();
const inventoryController = new InventoryController();

// Rotas vinculadas ao tenantId para isolamento
inventoryRouter.get('/:tenantId/products', inventoryController.listProducts);
inventoryRouter.post('/:tenantId/products', inventoryController.createProduct);
inventoryRouter.post('/:tenantId/products/:productId/stock', inventoryController.updateStock);

export { inventoryRouter };