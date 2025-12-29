import { Router } from 'express';
import { SalesController } from './sales.controller';

const router = Router();
const salesController = new SalesController();

router.post('/:tenantId/sales', salesController.create);
router.get('/:tenantId/sales', salesController.list);

export default router;