import { Request } from 'express';

export function getTenantId(req: Request): string | null {
  if (!req.user) {
    throw new Error('Usuário não autenticado');
  }

  return req.user.tenantId;
}
