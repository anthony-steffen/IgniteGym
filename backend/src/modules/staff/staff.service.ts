import { sequelize } from '../../database/sequelize';
import { User } from '../../database/models/user.model';
import { Employee } from '../../database/models/employee.model';
import { Tenant } from '../../database/models/tenant.model';
import bcrypt from 'bcrypt';
import { AppError } from '../../errors/AppError';

export class StaffService {
  /**
   * CRIAÇÃO DE STAFF / AUTO-REGISTRO
   * Unificado para suportar os novos campos de Employee (salário, jornada, etc)
   */
  static async create(data: any) {
    const {
      tenantId,
      email,
      password,
      name,
      roleTitle,
      gymName,
      salary,
      weeklyHours,
      workSchedule
    } = data;

    // 1️⃣ Validação de e-mail global
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Este e-mail já está cadastrado no sistema.', 409);
    }

    const transaction = await sequelize.transaction();

    try {
      let finalTenantId = tenantId;

      // 2️⃣ Se for um novo registro de academia (Dono), cria o Tenant primeiro
      if (!finalTenantId && gymName) {
        const newTenant = await Tenant.create({
          name: gymName,
          slug: gymName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''), // Gera slug amigável
          timezone: 'America/Sao_Paulo', // Valor padrão obrigatório
          is_active: true
        }, { transaction });
        finalTenantId = newTenant.id;
      }

      if (!finalTenantId) {
        throw new AppError('ID da unidade ou nome da academia é obrigatório.', 400);
      }

      // 3️⃣ Criar o Usuário
      const passwordHash = await bcrypt.hash(password, 8);
      const user = await User.create({
        name,
        email,
        password_hash: passwordHash,
        tenant_id: finalTenantId,
        role: roleTitle === 'GERENTE' || gymName ? 'ADMIN' : 'STAFF',
      }, { transaction });

      // 4️⃣ Criar o Perfil de Funcionário (Employee) associado
      // Aqui usamos a estrutura robusta que definimos para o RH
      await Employee.create({
        user_id: user.id,
        tenant_id: finalTenantId,
        role_title: roleTitle || (gymName ? 'Proprietário' : 'Funcionário'),
        is_active: true,
        salary: salary || 0,
        weekly_hours: weeklyHours || 44,
        work_schedule: workSchedule || {}, 
      }, { transaction });

      await transaction.commit();

      // Retornar o usuário com o perfil de funcionário incluído
      return await User.findByPk(user.id, {
        include: [{ model: Employee, as: 'employee' }]
      });

    } catch (error: any) {
      await transaction.rollback();
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro no registro: ${error.message}`, 500);
    }
  }

  /**
   * BUSCA TODOS OS MEMBROS (Utilizado para compatibilidade, mas o EmployeeService.listAll é o preferencial)
   */
  static async list(tenantId: string) {
    return await User.findAll({
      where: { tenant_id: tenantId },
      include: [{ model: Employee, as: 'employee', required: true }],
      attributes: { exclude: ['password_hash'] },
      order: [['name', 'ASC']]
    });
  }

  /**
   * BUSCA DETALHADA
   */
  static async findOne(userId: string) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  /**
   * ATUALIZAÇÃO DE DADOS (Unificado com a lógica de Employee)
   */
  static async update(userId: string, data: any) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const transaction = await sequelize.transaction();

    try {
      await user.update({
        name: data.name ?? user.name,
      }, { transaction });

      if (user.employee) {
        await user.employee.update({
          role_title: data.roleTitle ?? user.employee.role_title,
          salary: data.salary ?? user.employee.salary,
          weekly_hours: data.weeklyHours ?? user.employee.weekly_hours,
          work_schedule: data.workSchedule ?? user.employee.work_schedule,
          is_active: data.isActive ?? user.employee.is_active,
        }, { transaction });
      }

      await transaction.commit();
      return user;
    } catch (error: any) {
      await transaction.rollback();
      throw new AppError(`Erro ao atualizar os dados: ${error.message}`, 500);
    }
  }

  /**
   * DESATIVAÇÃO (Soft Delete)
   */
  static async deactivate(userId: string) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new AppError('Membro não encontrado para desativação.', 404);
    }

    if (user.employee) {
      await user.employee.update({ is_active: false });
    }
  }
}