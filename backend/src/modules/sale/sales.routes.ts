import { Router } from 'express';
import { SalesController } from './sales.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();
const salesController = new SalesController();

// Tradutor: Converte o nome da academia na URL para o ID interno
router.param('slug', tenantTranslate);

router.use(authMiddleware);

// Lista vendas da unidade: GET /sales/academia-exemplo
router.get('/:slug', salesController.list);

// Registra nova venda: POST /sales/academia-exemplo
// Apenas quem trabalha na unidade pode vender
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), salesController.create);

export default router;