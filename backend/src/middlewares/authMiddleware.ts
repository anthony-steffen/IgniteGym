import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

interface TokenPayload {
  userId: string;
  tenantId: string | null; // 🟢 Ajustado para aceitar null
  role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
  iat: number;
  exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    req.user = {
      id: decoded.userId,
      tenantId: decoded.tenantId ?? null, // 🟢 Uso do Nullish coalescing
      role: decoded.role,
    };

    return next();
  } catch (err) {
    console.log('❌ [DEBUG] Erro JWT:', err instanceof Error ? err.message : 'Unknown error');
    return res.status(401).json({ message: 'Token inválido' });
  }
}