import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      tenantId: string;
      role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
    }

    interface Request {
      user?: User;
    }
  }
}
