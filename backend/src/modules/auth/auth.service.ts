import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/user.model";
import { Tenant } from "../../database/models/tenant.model"; // Importe o modelo de Tenant
import { AppError } from "../../errors/AppError";

export class AuthService {
  static async login(email: string, password: string) {
    // 1. Busca o usuário INCLUINDO os dados da academia (Tenant)
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Tenant,
        as: 'tenant' // Certifique-se que o alias no seu arquivo de associação é 'tenant'
      }]
    });

    // 2. Validação de existência
    if (!user) {
      throw new AppError("E-mail ou senha incorretos", 401);
    }

    // 3. Valida a senha
    const valid = await bcrypt.compare(password, user.password_hash);
    
    if (!valid) {
      throw new AppError("E-mail ou senha incorretos", 401);
    }

    // 4. Verifica se a Secret do JWT existe
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("Erro interno: JWT_SECRET não configurada no servidor", 500);
    }

    // 5. Gera o Token (Agora com o slug também no payload, se desejar)
    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        slug: (user as any).tenant?.slug, // Adicionamos o slug ao token para facilitar o acesso
      },
      secret,
      { expiresIn: "1d" }
    );

    // 6. Retorna os dados mapeados corretamente
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        // Capturamos o slug através do relacionamento que incluímos no passo 1
        slug: (user as any).tenant?.slug || null, 
      },
    };
  }
}