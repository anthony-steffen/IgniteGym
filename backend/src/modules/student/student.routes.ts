import { Router } from 'express';
import { StudentController } from './student.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', StudentController.create);
router.get('/', StudentController.list);
router.patch('/:id/deactivate', StudentController.deactivate);

export default router;
