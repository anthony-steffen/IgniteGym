import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate'; // 👈 Importar o tradutor

const router = Router();

// Rota pública para registro inicial
router.post('/register', TenantController.register);

router.use(authMiddleware);

// Configura o tradutor de slug para as rotas que usarem :slug
router.param('slug', tenantTranslate);

// 1. Apenas o SUPER ADMIN lista todas as unidades
router.get('/', roleMiddleware(['ADMIN']), TenantController.list);

// 2. ROTA NORMALIZADA: Retorna os dados da unidade pelo slug
// Manager acessa a sua, Admin acessa qualquer uma
router.get('/:slug', TenantController.show); 

// 3. ROTA NORMALIZADA: Atualiza via slug
router.put('/:slug', TenantController.update);

// 4. Exclusão (Apenas Super Admin)
router.delete('/:slug', roleMiddleware(['ADMIN']), TenantController.delete);

export default router;