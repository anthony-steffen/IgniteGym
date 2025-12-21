import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../database/models/User";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
