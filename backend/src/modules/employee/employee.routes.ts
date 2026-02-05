import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

// Tradutor de slug para tenantId
router.param('slug', tenantTranslate);

/**
 * 🔒 ROTAS PROTEGIDAS
 * Para funcionários, a maioria das operações deve ser restrita a ADMIN ou MANAGER.
 */
router.use(authMiddleware);

// Lista todos os funcionários de uma academia
// GET /employees/academia-exemplo
router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.list);

// Cria um novo funcionário ou promove aluno
// POST /employees/academia-exemplo
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.create);

// Lista usuários (alunos) que podem ser "promovidos"
// GET /employees/academia-exemplo/eligible
router.get('/:slug/eligible', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.listEligibleUsers);

// Atualiza dados de um funcionário específico
// PUT /employees/academia-exemplo/:id
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.update);

// Remove/Desativa um funcionário
// DELETE /employees/academia-exemplo/:id
router.delete('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), EmployeeController.delete);

export default router;