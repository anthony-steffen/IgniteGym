import { Employee } from '../../database/models/employee.model';
import { User } from '../../database/models/user.model';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './dtos/employee.dto';
import { AppError } from '../../errors/AppError';

export class EmployeeService {
  /**
   * Lista usuários que podem ser contratados (pertencem à unidade mas não são staff)
   */
  async listEligibleUsers(tenantId: string) {
    try {
      const users = await User.findAll({
        where: { tenant_id: tenantId },
        attributes: ['id', 'name', 'email'],
        include: [{
          model: Employee,
          as: 'employee_profile',
          required: false
        }],
      });

      // Retorna apenas quem NÃO tem perfil de funcionário
      return users.filter(user => !user.employee);
    } catch (error) {
      throw new AppError('Erro ao buscar usuários elegíveis.', 500);
    }
  }

  async create(data: CreateEmployeeDTO) {
    const employeeExists = await Employee.findOne({
      where: { 
        user_id: data.userId, 
        tenant_id: data.tenantId 
      }
    });

    if (employeeExists) {
      throw new AppError('Este usuário já é funcionário desta unidade.', 409);
    }

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
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id: string, tenantId: string) {
    const employee = await Employee.findOne({
      where: { id, tenant_id: tenantId },
      include: ['user']
    });

    if (!employee) {
      throw new AppError('Funcionário não encontrado.', 404);
    }

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
    
    try {
      await employee.destroy();
    } catch (error) {
      throw new AppError('Não é possível remover este funcionário pois há registros vinculados a ele.', 400);
    }
  }
}