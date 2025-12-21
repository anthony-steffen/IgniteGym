import { Router } from 'express';
import { AuthService } from '../services/AuthService';

const router = Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email e senha são obrigatórios',
    });
  }

  try {
    const result = await AuthService.login({
      email,
      password,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(401).json({
      message: err.message || 'Falha na autenticação',
    });
  }
});



export default router;
