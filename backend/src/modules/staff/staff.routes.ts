import { Router } from 'express';
import { StaffController } from './staff.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.post('/', StaffController.create);
router.get('/', StaffController.list);
router.get('/:id', StaffController.findOne);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.deactivate);

export default router;
