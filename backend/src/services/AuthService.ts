import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { UserModel } from '../database/sequelize';

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  };
  token: string;
}

interface UserPayload {
  userId: string;
  tenantId: string;
  role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
}

export class AuthService {
  static async login({
    email,
    password,
  }: AuthRequest): Promise<AuthResponse> {
    const user = await UserModel.findOne({
      where: { email, is_active: true },
    });

    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    if (!user.password_hash) {
      throw new Error('Usuário sem senha cadastrada');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      throw new Error('Email ou senha inválidos');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
      },
      authConfig.jwt.secret,
      {
        expiresIn: authConfig.jwt.expiresIn,
      }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
      token,
    };
  }
}
