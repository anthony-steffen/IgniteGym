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

    return sequelize.transaction(async (t) => {
      let finalTenantId = tenantId;

      if (!finalTenantId && gymName) {
        const newTenant = await Tenant.create({
          name: gymName,
          slug: gymName.toLowerCase().trim().replace(/\s+/g, '-'),
          is_active: true,
          timezone: 'South America/Sao_Paulo',
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
          is_active: true,
        }, { transaction: t });
        targetUserId = newUser.id;
      }

      return Employee.create({
        user_id: targetUserId,
        tenant_id: finalTenantId,
        role_title: roleTitle,
        salary: salary || 0,
        weekly_hours: weeklyHours || 44,
        work_schedule: workSchedule || {},
        is_active: true,
      }, { transaction: t });
    });
  }

  static async list(tenantId: string, includeInactive = false) {
    const whereClause: Record<string, unknown> = { tenant_id: tenantId };

    if (!includeInactive) {
      whereClause.is_active = true;
    }

    const employees = await Employee.findAll({
      where: whereClause,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'is_active'] }],
      order: [['created_at', 'DESC']],
    });

    return employees.map((employee) => ({
      id: employee.id,
      roleTitle: employee.role_title,
      salary: Number(employee.salary),
      weeklyHours: employee.weekly_hours,
      workSchedule: employee.work_schedule,
      is_active: employee.is_active,
      user: employee.user,
    }));
  }

  static async update(id: string, tenantId: string, data: any) {
    const employee = await Employee.findOne({
      where: { id, tenant_id: tenantId },
      include: [{ model: User, as: 'user' }],
    });

    if (!employee) throw new AppError('Colaborador nao encontrado.', 404);

    return sequelize.transaction(async (t) => {
      if (data.name && employee.user) {
        await employee.user.update({ name: data.name }, { transaction: t });
      }

      return employee.update({
        role_title: data.roleTitle ?? employee.role_title,
        salary: data.salary ?? employee.salary,
        weekly_hours: data.weeklyHours ?? employee.weekly_hours,
        work_schedule: data.workSchedule ?? employee.work_schedule,
      }, { transaction: t });
    });
  }

  static async deactivate(id: string, tenantId: string) {
    const employee = await Employee.findOne({ where: { id, tenant_id: tenantId } });
    if (!employee) throw new AppError('Colaborador nao encontrado.', 404);

    await employee.update({ is_active: false });
    await User.update({ is_active: false }, { where: { id: employee.user_id } });
  }

  static async reactivate(id: string, tenantId: string) {
    const employee = await Employee.findOne({ where: { id, tenant_id: tenantId } });
    if (!employee) throw new AppError('Colaborador nao encontrado.', 404);

    await employee.update({ is_active: true });
    await User.update({ is_active: true }, { where: { id: employee.user_id } });
  }

  static async listEligibleUsers(tenantId: string) {
    const existingEmployeeIds = (await Employee.findAll({
      where: { tenant_id: tenantId },
      attributes: ['user_id'],
    })).map((employee) => employee.user_id);

    return User.findAll({
      where: { tenant_id: tenantId, id: { [Op.notIn]: existingEmployeeIds } },
      attributes: ['id', 'name', 'email'],
    });
  }
}
