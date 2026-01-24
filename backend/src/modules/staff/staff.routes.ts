import { Router } from 'express';
import { StaffController } from './staff.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

/**
 * 🔓 ROTA PÚBLICA
 * Permite o registro de novos administradores/proprietários (Auto-registro)
 * É aqui que a jornada do cliente começa no Frontend.
 */
router.post('/', StaffController.create);

/**
 * 🔒 ROTAS PROTEGIDAS
 * Daqui para baixo, todas as rotas exigem:
 * 1. Token JWT válido (authMiddleware)
 * 2. Perfil de Administrador (roleMiddleware)
 */
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// Listagem de todos os membros da equipe da unidade
router.get('/', StaffController.list);

// Detalhes de um membro específico
router.get('/:id', StaffController.findOne);

// Atualização de dados (User + Employee)
router.put('/:id', StaffController.update);

// Desativação lógica do membro (is_active: false)
router.delete('/:id', StaffController.deactivate);

export default router;