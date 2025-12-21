import 'express';

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      tenantId: string;
      role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
