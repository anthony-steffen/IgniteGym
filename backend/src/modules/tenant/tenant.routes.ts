import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

// Rota pública para registro inicial
router.post('/register', TenantController.register);

router.use(authMiddleware);

// Apenas o SUPER ADMIN pode listar todas as unidades do sistema
router.get('/', roleMiddleware(['ADMIN']), TenantController.list);

// Retorna os dados da própria academia (MANAGER/STAFF) ou de uma específica (ADMIN)
router.get('/me', TenantController.show); 

// Atualiza informações (Admin atualiza qualquer uma via ID no body, Manager atualiza a sua)
router.put('/update', TenantController.update);

// Exclui a academia (Protegido por ID na URL)
router.delete('/:id', roleMiddleware(['ADMIN']), TenantController.delete);

export default router;