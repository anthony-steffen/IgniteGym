import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const routes = Router();
const controller = new SubscriptionController();

routes.use(authMiddleware);

// criar assinatura
routes.post('/', controller.create.bind(controller));

// listar assinaturas do aluno
routes.get(
  '/students/:studentId',
  controller.listByStudent.bind(controller)
);

// cancelar assinatura
routes.delete('/:id', controller.cancel.bind(controller));

export default routes;
