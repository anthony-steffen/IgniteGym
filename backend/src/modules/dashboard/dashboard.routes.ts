import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

router.param('slug', tenantTranslate);
router.use(authMiddleware);

router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), DashboardController.show);

export default router;
