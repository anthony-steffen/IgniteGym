import { Router } from 'express';
import { CategoryController } from './category.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware);

router.get('/', controller.list);

// Apenas ADMIN e MANAGER podem manipular categorias
router.post('/', roleMiddleware(['ADMIN', 'MANAGER']), controller.create);
router.put('/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.update);
router.delete('/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.delete);

export default router;