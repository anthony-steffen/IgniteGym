import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

interface TokenPayload {
  userId: string;
  tenantId: string;
  role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    // 🚨 ADICIONE ESTAS LINHAS ABAIXO:
    req.user = {
      id: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    return next(); // 🚀 ESSENCIAL: Permite que a requisição chegue ao Controller
    // ----------------------------

  } catch (err) {
    console.log('❌ [DEBUG] Erro JWT:', err instanceof Error ? err.message : 'Unknown error'); 
    return res.status(401).json({ message: 'Token inválido' });
  }
}
