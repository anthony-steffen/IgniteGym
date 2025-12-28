// src/modules/checkin/checkin.routes.ts
import { Router } from 'express';
import { CheckInController } from './checkin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', CheckInController.create);
router.get('/student/:studentId', CheckInController.listByStudent);

export default router;
