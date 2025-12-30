// src/modules/employee/employee.service.ts
import { Employee } from '../../database/models/employee.model';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './dtos/employee.dto';

export class EmployeeService {
  async create(data: CreateEmployeeDTO) {
    return await Employee.create({
      user_id: data.userId,
      tenant_id: data.tenantId,
      role_title: data.roleTitle,
      is_active: true
    });
  }

  async listAll(tenantId: string) {
    return await Employee.findAll({
      where: { tenant_id: tenantId },
      include: ['user'], // Traz os dados do usuário (nome, email)
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id: string, tenantId: string) {
    const employee = await Employee.findOne({
      where: { id, tenant_id: tenantId },
      include: ['user']
    });
    if (!employee) throw new Error('Funcionário não encontrado');
    return employee;
  }

  async update(id: string, tenantId: string, data: UpdateEmployeeDTO) {
    const employee = await this.findById(id, tenantId);
    
    await employee.update({
      role_title: data.roleTitle ?? employee.role_title,
      is_active: data.isActive ?? employee.is_active
    });

    return employee;
  }

  async delete(id: string, tenantId: string) {
    const employee = await this.findById(id, tenantId);
    await employee.destroy();
  }
}