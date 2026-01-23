import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';
import { AppError } from '../../errors/AppError';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  async listEligible(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;
      const users = await this.employeeService.listEligibleUsers(tenantId);
      return res.json(users);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        message: error.message
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;
      const employee = await this.employeeService.create({ ...req.body, tenantId });
      return res.status(201).json(employee);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        message: error.message
      });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const { tenantId } = req.params;
      const employees = await this.employeeService.listAll(tenantId);
      return res.json(employees);
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id, tenantId } = req.params;
      const employee = await this.employeeService.findById(id, tenantId);
      return res.json(employee);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id, tenantId } = req.params;
      const employee = await this.employeeService.update(id, tenantId, req.body);
      return res.json(employee);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id, tenantId } = req.params;
      await this.employeeService.delete(id, tenantId);
      return res.status(204).send();
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  }
}