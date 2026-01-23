import { sequelize } from '../../database/sequelize';
import { User } from '../../database/models/user.model';
import { Employee } from '../../database/models/employee.model';
import { Tenant } from '../../database/models/tenant.model'; // Certifique-se de que este model existe
import { CreateStaffDTO } from './dtos/create-staff.dto';
import { UpdateStaffDTO } from './dtos/update-staff.dto';
import bcrypt from 'bcrypt';
import { AppError } from '../../errors/AppError';

export class StaffService {
  /**
   * CRIAÇÃO DE STAFF / AUTO-REGISTRO
   * Suporta criação de nova academia (Tenant) ou vínculo a uma existente.
   */
  static async create(data: CreateStaffDTO & { gymName?: string }) {
    const {
      tenantId,
      email,
      password,
      name,
      phone,
      roleTitle,
      gymName,
    } = data;

    // 1️⃣ Validação de e-mail global
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Este e-mail já está cadastrado no sistema.', 409);
    }

    try {
      return await sequelize.transaction(async (t) => {
        let finalTenantId = tenantId;

        // 2️⃣ Lógica de Auto-Registro (Criação de Tenant)
        // Se não houver tenantId mas houver gymName, estamos criando uma nova academia
        if (!finalTenantId && gymName) {
          const newTenant = await Tenant.create({
            name: gymName,
            slug: gymName.toLowerCase().trim().replace(/\s+/g, '-'),
            is_active: true,
            timezone: 'UTC',
          }, { transaction: t });
          
          finalTenantId = newTenant.id;
        }

        // Se após a checagem ainda não tivermos um ID, o request é inválido
        if (!finalTenantId) {
          throw new AppError('ID da academia não fornecido ou nome da academia ausente.', 400);
        }

        // 3️⃣ Definição de Role
        // Se o usuário está criando a academia (gymName presente), ele é ADMIN.
        // Se está sendo criado dentro de uma academia (tenantId presente), ele é STAFF.
        const userRole = gymName ? 'ADMIN' : 'STAFF';

        const passwordHash = await bcrypt.hash(password, 10);

        // 4️⃣ Criação do Usuário
        const user = await User.create({
          tenant_id: finalTenantId,
          email,
          password_hash: passwordHash,
          role: userRole,
          name: name ?? null,
          phone: phone ?? null,
          is_active: true
        }, { transaction: t });

        // 5️⃣ Criação do Perfil de Funcionário (Employee)
        await Employee.create({
          user_id: user.id,
          tenant_id: finalTenantId,
          role_title: roleTitle || (gymName ? 'Proprietário' : 'Funcionário'),
          is_active: true,
          salary: 0, 
          weekly_hours: 44,
          work_schedule: {},
        }, { transaction: t });

        return user;
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro ao processar criação:', error);
      throw new AppError('Erro ao processar criação de conta/academia.', 500);
    }
  }

  /**
   * LISTAGEM POR TENANT
   */
  static async list(tenantId: string) {
    return User.findAll({
      where: {
        tenant_id: tenantId,
        // Lista todos que não são alunos (Staff, Managers, Admins)
        role: ['STAFF', 'MANAGER', 'ADMIN'],
      },
      include: [
        {
          model: Employee,
          as: 'employee',
        },
      ],
      order: [['name', 'ASC']]
    });
  }

  /**
   * BUSCA DETALHADA
   */
  static async findOne(userId: string) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  /**
   * ATUALIZAÇÃO DE DADOS
   */
  static async update(userId: string, data: UpdateStaffDTO) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    try {
      await user.update({
        name: data.name ?? user.name,
        phone: data.phone ?? user.phone,
      });

      if (data.roleTitle && user.employee) {
        await user.employee.update({
          role_title: data.roleTitle,
        });
      }

      return user;
    } catch (error) {
      throw new AppError('Erro ao atualizar os dados.', 500);
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

    return await sequelize.transaction(async (t) => {
      if (user.employee) {
        await user.employee.update({ is_active: false }, { transaction: t });
      }
      await user.update({ is_active: false }, { transaction: t });
    });
  }
}