import { Router } from 'express';
import { TenantController } from '../tenant/tenant.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Rota pública para novos parceiros registrarem suas unidades
router.post('/register', TenantController.register);

// ROTAS PRIVADAS
// Exigem que o usuário esteja logado

router.use(authMiddleware);

// Retorna os dados da academia atual do usuário logado
router.get('/me', TenantController.show); 

// Atualiza informações da academia (Nome, Endereço, etc)
router.put('/update', TenantController.update);

// Exclui a academia e todos os dados vinculados (Cuidado!)
router.delete('/:id', TenantController.delete);

export default router;