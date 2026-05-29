import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/user.model";
import { Tenant } from "../../database/models/tenant.model";
import { AppError } from "../../errors/AppError";

export class AuthService {
  static async login(email: string, password: string) {
    if (!email || !password) {
      throw new AppError("E-mail e senha são obrigatórios.", 400);
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Tenant,
        as: 'tenant'
      }]
    });

    if (!user) {
      throw new AppError("E-mail ou senha incorretos", 401);
    }

    if (!user.is_active) {
      throw new AppError("Usuário inativo. Procure o administrador da unidade.", 403);
    }

    const tenant = (user as any).tenant as Tenant | undefined;

    if (user.tenant_id && !tenant) {
      throw new AppError("Unidade vinculada não encontrada.", 403);
    }

    if (tenant && !tenant.is_active) {
      throw new AppError("Unidade inativa. Entre em contato com o suporte.", 403);
    }

    if (!user.password_hash) {
      throw new AppError("Usuário sem credenciais de login configuradas.", 403);
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      throw new AppError("E-mail ou senha incorretos", 401);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("Erro interno: JWT_SECRET não configurada no servidor.", 500);
    }

    await user.update({ last_login_at: new Date() });

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        slug: tenant?.slug ?? null,
      },
      secret,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        slug: tenant?.slug ?? null,
      },
    };
  }
}
