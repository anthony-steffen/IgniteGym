import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

/**
 * 🔓 ROTA PÚBLICA / SEMI-PROTEGIDA
 * Usada para o registro inicial (Dono da Academia).
 * O hook useEmployees envia para POST /employees/${tenantId}
 */
router.post('/:tenantId?', EmployeeController.create);

/**
 * 🔒 ROTAS PROTEGIDAS
 * Exigem que o usuário esteja logado.
 */
router.use(authMiddleware);

// Lista todos os funcionários de um tenant específico
// GET /employees/${tenantId}
router.get('/:tenantId', EmployeeController.list);

// Lista usuários (alunos) que podem ser "promovidos" a funcionários
// GET /employees/${tenantId}/eligible
router.get('/:tenantId/eligible', EmployeeController.listEligibleUsers);

// Atualiza dados de um funcionário específico
// PUT /employees/${tenantId}/${id}
router.put('/:tenantId/:id', EmployeeController.update);

// Remove/Desativa um funcionário
// DELETE /employees/${tenantId}/${id}
router.delete('/:tenantId/:id', EmployeeController.delete);

export default router;