import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/user.model";
import { AppError } from "../../errors/AppError";

export class AuthService {
  static async login(email: string, password: string) {
    // 1. Busca o usuário
    const user = await User.findOne({ where: { email } });

    // 2. Se o usuário não existe, lançamos AppError 401
    // Usamos a mesma mensagem por segurança (não revelar se o email existe ou não)
    if (!user) {
      throw new AppError("E-mail ou senha incorretos", 401);
    }

    // 3. Valida a senha
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) {
      throw new AppError("E-mail ou senha incorretos", 401);
    }

    // 4. Verifica se a Secret do JWT existe para evitar erro de runtime
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("Erro interno: JWT_SECRET não configurada no servidor", 500);
    }

    // 5. Gera o Token
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
      },
      secret,
      { expiresIn: "1d" }
    );

    // 6. Retorna os dados (O Controller enviará isso como JSON)
    return {
      token,
      user: {
        id: user.id,
        name: user.name, // Adicionei o nome pois o frontend precisará para o Header
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
      },
    };
  }
}