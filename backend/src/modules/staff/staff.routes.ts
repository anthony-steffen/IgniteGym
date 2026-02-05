// src/modules/staff/staff.routes.ts
import { Router } from 'express';
import { StaffController } from './staff.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';

const router = Router();

// Tradutor automático: sempre que houver :slug na URL, preenche o req.tenantId
router.param('slug', tenantTranslate);

/**
 * 🔓 ROTA PÚBLICA
 * Registro inicial (Self-Service). Cria o tenant aqui, por isso não tem :slug.
 */
router.post('/', StaffController.create);

/**
 * 🔒 ROTAS PROTEGIDAS (Exigem Login)
 */
router.use(authMiddleware);

// Listagem: GET /staff/academia-principal
router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER']), StaffController.list);

// Detalhes: GET /staff/academia-principal/:id
router.get('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), StaffController.findOne);

// Atualização: PUT /staff/academia-principal/:id
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), StaffController.update);

// Desativação: DELETE /staff/academia-principal/:id
router.delete('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER']), StaffController.deactivate);

export default router;