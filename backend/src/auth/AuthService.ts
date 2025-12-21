import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { sequelize } from '../database/sequelize';

export class AuthService {
  async login(email: string, password: string) {
    const User = sequelize.models.User;

    const user = await User.findOne({
      where: { email, is_active: true },
    });

    if (!user || !user.getDataValue('password_hash')) {
      throw new Error('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.getDataValue('password_hash')
    );

    if (!passwordMatch) {
      throw new Error('Credenciais inválidas');
    }
    const signOptions: SignOptions = {
      expiresIn: authConfig.jwt.expiresIn,
    };

const token = jwt.sign(
  {
    userId: user.getDataValue('id'),
    tenantId: user.getDataValue('tenant_id'),
    role: user.getDataValue('role'),
  },
  authConfig.jwt.secret,
  signOptions
);


    return {
      token,
      user: {
        id: user.getDataValue('id'),
        email: user.getDataValue('email'),
        role: user.getDataValue('role'),
        tenant_id: user.getDataValue('tenant_id'),
      },
    };
  }
}
