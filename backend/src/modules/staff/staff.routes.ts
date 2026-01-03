// backend/src/modules/staff/staff.routes.ts
import { Router } from 'express';
import { StaffController } from './staff.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

// 🟢 Rota PÚBLICA: Permite que novos administradores se cadastrem
router.post('/', StaffController.create); 

// 🔴 Daqui para baixo, tudo exige login e ser ADMIN
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.get('/', StaffController.list);
router.get('/:id', StaffController.findOne);
router.put('/:id', StaffController.update);
router.delete('/:id', StaffController.deactivate);

export default router;