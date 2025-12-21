// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);
    return res.json(result);
  }
}
