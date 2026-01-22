// src/modules/employee/employee.routes.ts
import { Router } from 'express';
import { EmployeeController } from './employee.controller'
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();
const employeeController = new EmployeeController();

router.use(authMiddleware);

// Rota para listar usuários elegíveis para serem funcionários
router.get('/:tenantId/eligible', employeeController.listEligible);

// Rota para criar um novo funcionário
router.post('/:tenantId', employeeController.create);

// Rota para listar todos os funcionários da academia
router.get('/:tenantId', employeeController.index);

// Rota para visualizar um funcionário específico
router.get('/:tenantId/:id', employeeController.show);

// Rota para atualizar um funcionário
router.put('/:tenantId/:id', employeeController.update);

// Rota para excluir um funcionário
router.delete('/:tenantId/:id', employeeController.delete);

export default router;