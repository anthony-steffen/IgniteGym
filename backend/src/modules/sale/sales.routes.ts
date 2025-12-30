import { Router } from 'express';
import { SalesController } from './sales.controller';

const router = Router();
const salesController = new SalesController();

router.post('/:tenantId', salesController.create);
router.get('/:tenantId', salesController.list);

export default router;