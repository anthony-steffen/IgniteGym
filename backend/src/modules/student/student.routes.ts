import { Router } from 'express';
import { StudentController } from './student.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { tenantTranslate } from '../../middlewares/tenantTranslate';
import { roleMiddleware } from '../../middlewares/roleMiddleware';

const router = Router();

// Middleware que traduz o nome da academia na URL para o ID interno
router.param('slug', tenantTranslate);

router.use(authMiddleware);

// GET /students/unidade-centro -> Lista alunos da unidade
router.get('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.list);

// POST /students/unidade-centro -> Cadastra novo aluno
router.post('/:slug', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.create);

// PUT /students/unidade-centro/:id -> Atualiza dados
router.put('/:slug/:id', roleMiddleware(['ADMIN', 'MANAGER', 'STAFF']), StudentController.update);

// PATCH /students/unidade-centro/:id/deactivate -> Desativação lógica
router.patch('/:slug/:id/deactivate', roleMiddleware(['ADMIN', 'MANAGER']), StudentController.deactivate);

export default router;