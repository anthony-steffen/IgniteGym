import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const controller = new SubscriptionController();

// Tradutor de slug para tenantId (UUID)
router.param('slug', tenantTranslate);

router.use(authMiddleware);

// GET /subscriptions/academia-exemplo -> Lista matrículas da unidade
router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.list);

// POST /subscriptions/academia-exemplo -> Matricula um aluno em um plano
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), controller.create);

// PUT /subscriptions/academia-exemplo/:id -> Renova ou altera matrícula
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.update);

// DELETE /subscriptions/academia-exemplo/:id -> Cancela matrícula
router.delete('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.cancel);

export default router;