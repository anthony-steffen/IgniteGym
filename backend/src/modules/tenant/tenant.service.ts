import { sequelize } from '../../database/sequelize';
import { Tenant } from '../../database/models/tenant.model';
import { User } from '../../database/models/user.model';
import { CreateTenantDTO } from './dtos/TenantDTO';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcrypt';

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

        // O usuário criado aqui é o MANAGER da unidade, não o SUPER ADMIN
        const user = await User.create({
          tenant_id: tenant.id,
          name: data.admin_name,
          email: data.admin_email,
          password_hash,
          role: 'MANAGER', // Alterado de ADMIN para MANAGER para diferenciar do SuperAdmin
          is_active: true,
        }, { transaction: t });

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
  
  static async update(id: string, data: Partial<CreateTenantDTO>) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new AppError('Academia não encontrada.', 404);

    if (data.slug && data.slug !== tenant.slug) {
      const slugExists = await Tenant.findOne({ where: { slug: data.slug } });
      if (slugExists) throw new AppError('Este slug já está em uso.', 409);
    }

    await tenant.update(data);
    return tenant;
  }

  static async delete(id: string) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new AppError('Academia não encontrada.', 404);

    try {
      return await sequelize.transaction(async (t) => {
        await User.destroy({ where: { tenant_id: id }, transaction: t });
        await tenant.destroy({ transaction: t });
        return { message: 'Unidade e usuários removidos com sucesso.' };
      });
    } catch (error) {
      throw new AppError('Erro ao excluir unidade.', 500);
    }
  }
}