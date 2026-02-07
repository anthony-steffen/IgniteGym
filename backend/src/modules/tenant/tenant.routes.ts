import { Router } from 'express';
import { TenantController } from './tenant.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';

const router = Router();

// Rota pública para registro inicial
router.post('/register', TenantController.register);

router.use(authMiddleware);

// Configura o tradutor de slug: Sempre que houver ':slug', o req.tenantId será preenchido
router.param('slug', tenantTranslate);

// 1. Apenas o SUPER ADMIN (Role: ADMIN) lista todas as unidades
router.get('/', roleMiddleware(['ADMIN']), TenantController.list);

// 2. Detalhes da Unidade (Dono vê a sua, Super Admin vê qualquer uma via slug)
router.get('/:slug', TenantController.show); 

// 3. Atualização da Unidade (Dono atualiza a sua, Super Admin atualiza qualquer uma)
router.put('/:slug', TenantController.update);

// 4. Exclusão (Apenas Super Admin)
router.delete('/:slug', roleMiddleware(['ADMIN']), TenantController.delete);

export default router;