import { Router } from 'express';
import { CheckinController } from './checkin.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new CheckinController();

// Tradutor de slug para tenantId (UUID)
router.param('slug', tenantTranslate);

router.use(authMiddleware);

// GET /checkins/academia-exemplo -> Lista histórico de presenças da unidade
router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.list);

// POST /checkins/academia-exemplo -> Realiza a entrada de um aluno
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.create);

// GET /checkins/academia-exemplo/student/:studentId -> Histórico de um aluno específico
router.get('/:slug/student/:studentId', controller.listByStudent);

export default router;