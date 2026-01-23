import bcrypt from 'bcrypt'; 
import { Employee } from '../../database/models/employee.model';
import { User } from '../../database/models/user.model';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './dtos/employee.dto';
import { AppError } from '../../errors/AppError';
import { sequelize } from '../../database/sequelize';

export class EmployeeService {

  async listEligibleUsers(tenantId: string) {
    try {
      const users = await User.findAll({
        where: { tenant_id: tenantId },
        attributes: ['id', 'name', 'email'],
        include: [{
          model: Employee,
          as: 'employee',
          required: false
        }],
      });
      return users.filter(user => !user.employee);
    } catch (error: any) {
      throw new AppError(`Erro ao carregar usuários: ${error.message}`, 500);
    }
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

  async create(data: CreateEmployeeDTO) {
    const transaction = await sequelize.transaction();

    try {
      let targetUserId = data.userId;

      if (!targetUserId) {
        if (!data.name || !data.email || !data.password) {
          throw new AppError('Nome, e-mail e senha são obrigatórios para novos funcionários.', 400);
        }

        const userExists = await User.findOne({ where: { email: data.email } });
        if (userExists) {
          throw new AppError('Este e-mail já está em uso por outro usuário.', 400);
        }

        const passwordHash = await bcrypt.hash(data.password, 8);

        const newUser = await User.create({
          name: data.name,
          email: data.email,
          password_hash: passwordHash,
          tenant_id: data.tenantId,
          role: data.roleTitle === 'GERENTE' ? 'ADMIN' : 'STAFF',
        }, { transaction });

        targetUserId = newUser.id;
      }

      const employeeExists = await Employee.findOne({
        where: { user_id: targetUserId, tenant_id: data.tenantId }
      });

      if (employeeExists) {
        throw new AppError('Este usuário já possui um perfil de funcionário ativo.', 409);
      }

      // Verificação das colunas antes da criação para evitar erro 500 silencioso
      const employee = await Employee.create({
        user_id: targetUserId,
        tenant_id: data.tenantId,
        role_title: data.roleTitle,
        is_active: true,
        salary: data.salary,
        weekly_hours: data.weeklyHours, // Certifique-se que o Model aceita weeklyHours -> mapeia para weekly_hours
        work_schedule: data.workSchedule,
      }, { transaction });

      await transaction.commit();
      return employee;

    } catch (error: any) {
      await transaction.rollback();
      // Se já for um AppError, apenas repassa. Se não for, cria um explicativo.
      if (error instanceof AppError) throw error;
      throw new AppError(`Falha na criação: ${error.message}`, 500);
    }
  }

  async findById(id: string, tenantId: string) {
    const employee = await Employee.findOne({
      where: { id, tenant_id: tenantId },
      include: [{ model: User, as: 'user' }]
    });

    if (!employee) {
      throw new AppError('Funcionário não localizado no sistema.', 404);
    }

    return employee;
  }

  async update(id: string, tenantId: string, data: UpdateEmployeeDTO) {
    const employee = await this.findById(id, tenantId);
    
    try {
      await employee.update({
        role_title: data.roleTitle ?? employee.role_title,
        is_active: data.isActive ?? employee.is_active,
        salary: data.salary ?? employee.salary,
        weekly_hours: data.weeklyHours ?? employee.weekly_hours,
        work_schedule: data.workSchedule ?? employee.work_schedule
      });
      return employee;
    } catch (error: any) {
      throw new AppError(`Erro ao atualizar dados: ${error.message}`, 500);
    }
  }

  async delete(id: string, tenantId: string) {
    const employee = await this.findById(id, tenantId);
    try {
      await employee.destroy();
    } catch (error: any) {
      throw new AppError('Impossível remover funcionário com registros de ponto ou aulas vinculadas.', 400);
    }
  }
}