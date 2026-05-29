import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new SubscriptionController();

router.param('slug', tenantTranslate);
router.use(authMiddleware);

router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.list);
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.create);
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.update);
router.delete('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.cancel);
router.patch('/:slug/:id/reactivate', roleMiddleware(['ADMIN', 'MANAGER']), controller.reactivate);
router.delete('/:slug/:id/permanent', roleMiddleware(['ADMIN', 'MANAGER']), controller.remove);
router.patch('/:slug/:id/payment', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.payment);

export default router;
