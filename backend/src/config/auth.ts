// backend/src/config/auth.ts
import { Secret } from 'jsonwebtoken';
export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'unsafe-dev-secret' as Secret,
    expiresIn: '1d' as const,
  },
};
