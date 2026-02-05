// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AppError } from "../../errors/AppError";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Chama o service que agora retorna token + user (com slug e tenant_id)
      const result = await AuthService.login(email, password);
      
      return res.json(result);
    } catch (error: any) {
      // Tratamento de erro padronizado
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }
}