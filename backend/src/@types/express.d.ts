// src/@types/express.d.ts
import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      tenantId: string | null;
      role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
    }

    interface Request {
      user: User;
      tenantId?: string; // 🟢 Adicionado para suportar tenantTranslate middleware
    }
  }
}
