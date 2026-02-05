import { Router } from 'express';
import { PlanController } from './plan.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const routes = Router();
const controller = new PlanController();

// Tradutor de slug para tenantId
routes.param('slug', tenantTranslate);

routes.use(authMiddleware);

// GET /plans/academia-principal
routes.get('/:slug', controller.list);

// Apenas ADMIN e MANAGER podem manipular planos
// POST /plans/academia-principal
routes.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER']), controller.create);

// PUT /plans/academia-principal/:id
routes.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.update);

// DELETE /plans/academia-principal/:id
routes.delete('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), controller.deactivate);

export default routes;