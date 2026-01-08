import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new InventoryController();

router.use(authMiddleware);

router.get('/products', controller.listProducts);
router.post('/products', roleMiddleware(['ADMIN', 'MANAGER']), controller.createProduct);
router.put('/products/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.updateProduct);
router.delete('/products/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.deleteProduct);

export default router;