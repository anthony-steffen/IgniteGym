import { Router } from 'express';
import { PlanController } from './plan.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const routes = Router();
const controller = new PlanController();

routes.use(authMiddleware);

routes.post('/', controller.create);
routes.get('/', controller.list);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.deactivate);

export default routes;
