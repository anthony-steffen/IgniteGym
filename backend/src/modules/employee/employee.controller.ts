import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';
import { AppError } from '../../errors/AppError';

export class EmployeeController {
  /**
   * CRIAÇÃO / CONTRATAÇÃO
   * Trata tanto o registro de novos usuários quanto a promoção de alunos a funcionários.
   */
  static async create(req: Request, res: Response) {
    try {
      // O tenantId pode vir da URL (via hook) ou do body
      const tenantId = req.params.tenantId || req.body.tenantId;
      
      const employee = await EmployeeService.create({
        ...req.body,
        tenantId
      });

      return res.status(201).json(employee);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        message: error.message || "Erro ao criar registro de funcionário."
      });
    }
  }

  /**
   * LISTAGEM DE FUNCIONÁRIOS
   * Retorna a lista de Employees com os dados de User incluídos.
   */
  static async list(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;

      if (!tenantId) {
        throw new AppError("O ID da unidade é obrigatório.", 400);
      }

      const employees = await EmployeeService.list(tenantId);
      return res.json(employees);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  /**
   * USUÁRIOS ELEGÍVEIS
   * Lista usuários que pertencem ao tenant mas ainda não são funcionários.
   */
  static async listEligibleUsers(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;
      const users = await EmployeeService.listEligibleUsers(tenantId);
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  /**
   * ATUALIZAÇÃO UNIFICADA
   * Atualiza dados de cargo, salário e horários no Employee, e nome no User.
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params; // ID do Employee
      const employee = await EmployeeService.update(id, req.body);
      
      return res.json(employee);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  /**
   * DESATIVAÇÃO / REMOÇÃO
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await EmployeeService.deactivate(id);
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