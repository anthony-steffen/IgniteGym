import { Router } from 'express';
import { TenantController } from '../tenant/tenant.controller';

const router = Router();

// Rota pública para novos parceiros registrarem suas unidades
router.post('/register', TenantController.register);

export default router;