// src/modules/employee/employee.service.ts
import { Employee } from '../../database/models/employee.model';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './dtos/employee.dto';
import { AppError } from '../../errors/AppError';

export class EmployeeService {
  async create(data: CreateEmployeeDTO) {
    // 1️⃣ Valida se o usuário já é funcionário nesta academia
    const employeeExists = await Employee.findOne({
      where: { 
        user_id: data.userId, 
        tenant_id: data.tenantId 
      }
    });

    if (employeeExists) {
      throw new AppError('Este usuário já está cadastrado como funcionário nesta unidade.', 409);
    }

    try {
      return await Employee.create({
        user_id: data.userId,
        tenant_id: data.tenantId,
        role_title: data.roleTitle,
        is_active: true
      });
    } catch (error) {
      console.error('❌ Erro ao criar funcionário:', error);
      throw new AppError('Não foi possível cadastrar o funcionário.', 500);
    }
  }

  async listAll(tenantId: string) {
    return await Employee.findAll({
      where: { tenant_id: tenantId },
      include: ['user'], 
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id: string, tenantId: string) {
    const employee = await Employee.findOne({
      where: { id, tenant_id: tenantId },
      include: ['user']
    });

    // 2️⃣ Substituindo o Error genérico por AppError 404
    if (!employee) {
      throw new AppError('Funcionário não encontrado.', 404);
    }

    return employee;
  }

  async update(id: string, tenantId: string, data: UpdateEmployeeDTO) {
    // O findById já lança AppError 404 se não encontrar
    const employee = await this.findById(id, tenantId);
    
    try {
      await employee.update({
        role_title: data.roleTitle ?? employee.role_title,
        is_active: data.isActive ?? employee.is_active
      });

      return employee;
    } catch (error) {
      throw new AppError('Erro ao atualizar dados do funcionário.', 500);
    }
  }

  async delete(id: string, tenantId: string) {
    const employee = await this.findById(id, tenantId);
    
    try {
      await employee.destroy();
    } catch (error) {
      // Se houver dependências (ex: o funcionário deu aulas), o Sequelize pode barrar
      throw new AppError('Não é possível excluir este funcionário pois ele possui registros vinculados.', 400);
    }
  }
}