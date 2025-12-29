import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

const inventoryController = new InventoryController();

// Rotas vinculadas ao tenantId para isolamento
router.get('/:tenantId/products', inventoryController.listProducts);
router.post('/:tenantId/products', inventoryController.createProduct);
router.post('/:tenantId/products/:productId/stock', inventoryController.updateStock);

export default router ;