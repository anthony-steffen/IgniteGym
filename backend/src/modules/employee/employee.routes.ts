import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();
const employeeController = new EmployeeController();

// Todas as rotas de funcionários exigem autenticação
router.use(authMiddleware);

/**
 * ROTA: Listar usuários disponíveis para contratação (Select do Modal)
 * IMPORTANTE: Esta rota deve vir antes de '/:tenantId/:id' para não haver conflito de parâmetros.
 */
router.get('/:tenantId/eligible', (req, res) => employeeController.listEligible(req, res));

/**
 * ROTA: Listar todos os funcionários de uma unidade (Tabela principal)
 */
router.get('/:tenantId', (req, res) => employeeController.index(req, res));

/**
 * ROTA: Buscar detalhes de um funcionário específico
 */
router.get('/:tenantId/:id', (req, res) => employeeController.findById(req, res));

/**
 * ROTA: Criar novo funcionário
 * Suporta: Promoção de usuário existente (userId) ou Criação Direta (name, email, password)
 */
router.post('/:tenantId', (req, res) => employeeController.create(req, res));

/**
 * ROTA: Atualizar dados do funcionário (Cargo, Salário, Horários, Status)
 */
router.put('/:tenantId/:id', (req, res) => employeeController.update(req, res));

/**
 * ROTA: Remover vínculo de funcionário
 */
router.delete('/:tenantId/:id', (req, res) => employeeController.delete(req, res));

export default router;