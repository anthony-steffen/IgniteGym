// src/modules/employee/employee.routes.ts
import { Router } from 'express';
import { EmployeeController } from './employee.controller'
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();
const employeeController = new EmployeeController();

router.use(authMiddleware);

router.get('/:tenantId', (req, res) => employeeController.index(req, res));
router.get('/:tenantId/:id', (req, res) => employeeController.show(req, res));
router.post('/:tenantId', (req, res) => employeeController.create(req, res));
router.put('/:tenantId/:id', (req, res) => employeeController.update(req, res));
router.delete('/:tenantId/:id', (req, res) => employeeController.delete(req, res));

export default router;