import { sequelize } from '../../database/sequelize';
import { Tenant } from '../../database/models/tenant.model';
import { User } from '../../database/models/user.model';
import { Category } from '../../database/models/category.model';
import { Employee } from '../../database/models/employee.model';
import { CreateTenantDTO } from './dtos/TenantDTO';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcrypt';

const DEFAULT_CATEGORY_NAMES = [
  'Suplementos Alimentares',
  'Equipamentos e Maquinas',
  'Acessorios e Vestuario',
];

const DEFAULT_ADMIN_WORK_SCHEDULE = {
  mon: '08:00-12:00,13:00-17:00',
  tue: '08:00-12:00,13:00-17:00',
  wed: '08:00-12:00,13:00-17:00',
  thu: '08:00-12:00,13:00-17:00',
  fri: '08:00-12:00,13:00-17:00',
  sat: '08:00-12:00',
};

export class TenantService {
  static async create(data: CreateTenantDTO) {
    const tenantExists = await Tenant.findOne({ where: { slug: data.slug } });
    if (tenantExists) throw new AppError('Este slug já está em uso.', 409);

    const userExists = await User.findOne({ where: { email: data.admin_email } });
    if (userExists) throw new AppError('Este e-mail já está em uso.', 409);

    try {
      return await sequelize.transaction(async (t) => {
        const tenant = await Tenant.create({
          name: data.name,
          slug: data.slug,
          address: data.address ?? null,
          contact_email: data.contact_email ?? null,
          timezone: 'America/Sao_Paulo',
          is_active: true,
        }, { transaction: t });

        const password_hash = await bcrypt.hash(data.admin_password, 8);

        const user = await User.create({
          tenant_id: tenant.id,
          name: data.admin_name,
          email: data.admin_email,
          password_hash,
          role: 'MANAGER', 
        }, { transaction: t });

        await Employee.create({
          tenant_id: tenant.id,
          user_id: user.id,
          role_title: 'GERENTE',
          salary: 0,
          weekly_hours: 44,
          work_schedule: DEFAULT_ADMIN_WORK_SCHEDULE,
          is_active: true,
        }, { transaction: t });

        await Category.bulkCreate(
          DEFAULT_CATEGORY_NAMES.map((name) => ({
            tenant_id: tenant.id,
            name,
          })),
          { transaction: t }
        );

        return { tenant, admin: { id: user.id, name: user.name, email: user.email } };
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao registrar unidade.', 500);
    }
  }

  static async findAll() {
    return await Tenant.findAll();
  }

  static async show(tenantId: string) {
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) throw new AppError('Unidade não encontrada.', 404);
    return tenant;
  }
  
  static async update(id: string, data: any) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new AppError('Academia não encontrada.', 404);

    // Se houver tentativa de mudar o slug, verificamos disponibilidade
    if (data.slug && data.slug !== tenant.slug) {
      const slugExists = await Tenant.findOne({ where: { slug: data.slug } });
      if (slugExists) throw new AppError('Este slug já está em uso.', 409);
    }

    // Atualiza apenas os campos permitidos enviados no objeto data
    await tenant.update(data);
    return tenant;
  }

  static async delete(id: string) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new AppError('Academia não encontrada.', 404);

    try {
      return await sequelize.transaction(async (t) => {
        // Remove todos os usuários vinculados à unidade antes de remover a unidade
        await User.destroy({ where: { tenant_id: id }, transaction: t });
        await tenant.destroy({ transaction: t });
      });
    } catch (error) {
      throw new AppError('Erro ao excluir unidade e seus dados.', 500);
    }
  }
}
