import { Router } from 'express';
import { StudentController } from './student.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

router.param('slug', tenantTranslate);
router.use(authMiddleware);

router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.list);
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.create);
router.get('/:slug/:id/history', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.history);
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.update);
router.patch('/:slug/:id/deactivate', roleMiddleware(['ADMIN', 'MANAGER']), StudentController.deactivate);
router.patch('/:slug/:id/reactivate', roleMiddleware(['ADMIN', 'MANAGER']), StudentController.reactivate);

export default router;
