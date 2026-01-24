import { Request, Response } from 'express';
import { StaffService } from './staff.service';
import { AppError } from '../../errors/AppError';

export class StaffController {
  /**
   * Registro / Criação de Membro
   * Este método atende tanto o registro inicial (Dono) quanto a criação de equipe.
   */
  static async create(req: Request, res: Response) {
    try {
      // Recebe o corpo da requisição (inclui salary, weeklyHours, workSchedule, gymName, etc.)
      const staff = await StaffService.create(req.body);
      
      return res.status(201).json(staff);
    } catch (error: any) {
      console.error("❌ Erro ao criar staff:", error);
      
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        message: error.message || "Erro inesperado ao processar o registro."
      });
    }
  }

  /**
   * Listagem de membros da Unidade
   * Utiliza o tenantId extraído do token de autenticação (req.user)
   */
  static async list(req: Request, res: Response) {
    try {
      if (!req.user?.tenantId) {
        throw new AppError('Tenant ID não identificado no token.', 401);
      }

      const staff = await StaffService.list(req.user.tenantId);
      return res.json(staff);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  /**
   * Detalhes de um membro específico
   */
  static async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const staff = await StaffService.findOne(id);
      return res.json(staff);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  /**
   * Atualização Unificada
   * Atualiza dados do Usuário (User) e do Funcionário (Employee) simultaneamente
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const staff = await StaffService.update(id, req.body);
      return res.json(staff);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  /**
   * Desativação (Soft Delete)
   * Em vez de deletar, altera o status is_active do funcionário para false
   */
  static async deactivate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await StaffService.deactivate(id);
      return res.status(204).send();
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }
}