import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const inventoryController = new InventoryController();

// Todas as rotas de inventário exigem autenticação
router.use(authMiddleware);

// Listagem e Criação (Apenas STAFF, MANAGER e ADMIN)
router.get('/products', inventoryController.listProducts);
router.post('/products', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), inventoryController.createProduct);

// Movimentação de estoque específica
router.post('/products/:productId/stock', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), inventoryController.updateStock);

export default router;