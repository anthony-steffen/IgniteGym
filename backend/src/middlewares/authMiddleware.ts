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

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;

    // 🔑 CONTRATO ÚNICO DA API
    req.user = {
      id: decoded.userId,        // ✅ PADRÃO
      tenantId: decoded.tenantId, // ✅ camelCase
      role: decoded.role,
    };

    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
