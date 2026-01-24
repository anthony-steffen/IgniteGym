import { Op } from 'sequelize';
import { sequelize } from '../../database/sequelize';
import { User } from '../../database/models/user.model';
import { Employee } from '../../database/models/employee.model';
import { Tenant } from '../../database/models/tenant.model';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcrypt';

export class EmployeeService {
  static async create(data: any) {
    const { tenantId, email, password, name, roleTitle, gymName, salary, weeklyHours, workSchedule, userId } = data;

    return await sequelize.transaction(async (t) => {
      let finalTenantId = tenantId;

      if (!finalTenantId && gymName) {
        const newTenant = await Tenant.create({
          name: gymName,
          slug: gymName.toLowerCase().trim().replace(/\s+/g, '-'),
          is_active: true,
          timezone: 'South America/Sao_Paulo'
        }, { transaction: t });
        finalTenantId = newTenant.id;
      }

      let targetUserId = userId;
      if (!targetUserId && email) {
        const passwordHash = await bcrypt.hash(password || '123456', 10);
        const newUser = await User.create({
          tenant_id: finalTenantId,
          email,
          name,
          password_hash: passwordHash,
          role: gymName ? 'ADMIN' : 'STAFF',
          is_active: true
        }, { transaction: t });
        targetUserId = newUser.id;
      }

      return await Employee.create({
        user_id: targetUserId,
        tenant_id: finalTenantId,
        role_title: roleTitle,
        salary: salary || 0,
        weekly_hours: weeklyHours || 44,
        work_schedule: workSchedule || {},
        is_active: true
      }, { transaction: t });
    });
  }

  static async list(tenantId: string) {
    const employees = await Employee.findAll({
      where: { tenant_id: tenantId, is_active: true },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']]
    });

    // 💡 AQUI ESTÁ A CHAVE: Mapeamos para camelCase antes de enviar ao Front
    return employees.map(emp => ({
      id: emp.id,
      roleTitle: emp.role_title,
      salary: Number(emp.salary),
      weeklyHours: emp.weekly_hours,
      workSchedule: emp.work_schedule,
      user: emp.user
    }));
  }

  static async update(id: string, data: any) {
    const employee = await Employee.findByPk(id, { include: [{ model: User, as: 'user' }] });
    if (!employee) throw new AppError('Colaborador não encontrado.', 404);

    return await sequelize.transaction(async (t) => {
      if (data.name && employee.user) {
        await employee.user.update({ name: data.name }, { transaction: t });
      }
      return await employee.update({
        role_title: data.roleTitle ?? employee.role_title,
        salary: data.salary ?? employee.salary,
        weekly_hours: data.weeklyHours ?? employee.weekly_hours,
        work_schedule: data.workSchedule ?? employee.work_schedule,
      }, { transaction: t });
    });
  }

  static async deactivate(id: string) {
    const employee = await Employee.findByPk(id);
    if (!employee) throw new AppError('Colaborador não encontrado.', 404);
    await employee.update({ is_active: false });
  }

  static async listEligibleUsers(tenantId: string) {
    const existingEmployeeIds = (await Employee.findAll({
      where: { tenant_id: tenantId },
      attributes: ['user_id']
    })).map(e => e.user_id);

    return await User.findAll({
      where: { tenant_id: tenantId, id: { [Op.notIn]: existingEmployeeIds } },
      attributes: ['id', 'name', 'email']
    });
  }
}