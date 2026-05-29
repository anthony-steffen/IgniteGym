import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

router.param('slug', tenantTranslate);
router.use(authMiddleware);

router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.list);
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.create);
router.get('/:slug/eligible', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.listEligibleUsers);
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.update);
router.delete('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.delete);
router.patch('/:slug/:id/reactivate', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.reactivate);

export default router;
