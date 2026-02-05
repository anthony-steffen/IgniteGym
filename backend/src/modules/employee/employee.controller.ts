import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';
import { AppError } from '../../errors/AppError';

export class EmployeeController {
  static async create(req: Request, res: Response) {
    try {
      // tenantId extraído do middleware tenantTranslate via slug
      const tenantId = req.tenantId as string;
      
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

  static async list(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string;

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

  static async listEligibleUsers(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId as string;
      const users = await EmployeeService.listEligibleUsers(tenantId);
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ 
        status: "error", 
        message: error.message 
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params; // ID do Employee continua sendo UUID
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