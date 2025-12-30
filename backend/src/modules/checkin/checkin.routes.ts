// src/modules/checkin/checkin.routes.ts
import { Router } from 'express';
import { CheckInController } from './checkin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

const checkInController = new CheckInController();

router.use(authMiddleware);

router.post('/', checkInController.create);
router.get('/student/:studentId', checkInController.listByStudent);

export default router;
 