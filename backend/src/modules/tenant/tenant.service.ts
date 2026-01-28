import { sequelize } from '../../database/sequelize';
import { Tenant } from '../../database/models/tenant.model';
import { User } from '../../database/models/user.model';
import { CreateTenantDTO } from './dtos/TenantDTO';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcrypt';

export class TenantService {
  static async create(data: CreateTenantDTO) {
    // 1️⃣ Verificar se o slug da unidade já existe
    const tenantExists = await Tenant.findOne({ where: { slug: data.slug } });
    if (tenantExists) {
      throw new AppError('Este slug já está em uso por outra unidade.', 409);
    }

    // 2️⃣ Verificar se o email do admin já existe
    const userExists = await User.findOne({ where: { email: data.admin_email } });
    if (userExists) {
      throw new AppError('Este e-mail já está em uso por outro usuário.', 409);
    }

    try {
      return await sequelize.transaction(async (t) => {
        // 3️⃣ Criar o Tenant
        const tenant = await Tenant.create({
          name: data.name,
          slug: data.slug,
          address: data.address ?? null,
          contact_email: data.contact_email ?? null,
          timezone: 'America/Sao_Paulo',
          is_active: true,
        }, { transaction: t });

        // 4️⃣ Criar o Usuário Administrador vinculado ao Tenant
        const password_hash = await bcrypt.hash(data.admin_password, 8);

        const user = await User.create({
          tenant_id: tenant.id,
          name: data.admin_name,
          email: data.admin_email,
          password_hash,
          role: 'ADMIN',
          is_active: true,
        }, { transaction: t });

        return { tenant, admin: { id: user.id, name: user.name, email: user.email } };
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro ao registrar unidade:', error);
      throw new AppError('Erro ao processar o registro da unidade.', 500);
    }
  }

    static async show(tenantId: string) {
    const tenant = await Tenant.findByPk(tenantId);

    if (!tenant) {
      throw new AppError('Unidade não encontrada.', 404);
    }

    return tenant;
  }
  
    static async update(id: string, data: Partial<CreateTenantDTO>) {
    const tenant = await Tenant.findByPk(id);
    if (!tenant) throw new AppError('Academia não encontrada.', 404);

    // Se estiver mudando o slug, verificar se o novo já existe
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
        // 1. Opcional: Remover todos os usuários vinculados primeiro
        await User.destroy({ where: { tenant_id: id }, transaction: t });
        
        // 2. Remover a academia
        await tenant.destroy({ transaction: t });
        
        return { message: 'Unidade e usuários removidos com sucesso.' };
      });
    } catch (error) {
      throw new AppError('Erro ao excluir unidade. Verifique se existem dependências.', 500);
    }
  }
}