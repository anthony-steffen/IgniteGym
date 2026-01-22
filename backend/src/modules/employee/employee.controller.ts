import { Request, Response } from 'express';
import { EmployeeService } from './employee.service';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  // Novo método para o Select do Modal no Front-end
  async listEligible(req: Request, res: Response) {
    const { tenantId } = req.params;
    const users = await this.employeeService.listEligibleUsers(tenantId);
    return res.json(users);
  }

  async create(req: Request, res: Response) {
    const { tenantId } = req.params;
    const employee = await this.employeeService.create({ ...req.body, tenantId });
    return res.status(201).json(employee);
  }

  async index(req: Request, res: Response) {
    const { tenantId } = req.params;
    const employees = await this.employeeService.listAll(tenantId);
    return res.json(employees);
  }

  async show(req: Request, res: Response) {
    const { id, tenantId } = req.params;
    const employee = await this.employeeService.findById(id, tenantId);
    return res.json(employee);
  }

  async update(req: Request, res: Response) {
    const { id, tenantId } = req.params;
    const employee = await this.employeeService.update(id, tenantId, req.body);
    return res.json(employee);
  }

  async delete(req: Request, res: Response) {
    const { id, tenantId } = req.params;
    await this.employeeService.delete(id, tenantId);
    return res.status(204).send();
  }
}