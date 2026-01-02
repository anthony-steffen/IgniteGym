import { sequelize } from '../../database/sequelize';
import { User } from '../../database/models/user.model';
import { Employee } from '../../database/models/employee.model';
import { CreateStaffDTO } from './dtos/create-staff.dto';
import { UpdateStaffDTO } from './dtos/update-staff.dto';
import bcrypt from 'bcrypt';
import { AppError } from '../../errors/AppError';

export class StaffService {
  static async create(data: CreateStaffDTO) {
    const {
      tenantId,
      email,
      password,
      name,
      phone,
      roleTitle,
    } = data;

    // 1️⃣ Verifica se e-mail já está em uso (Geral ou no Tenant)
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Este e-mail já está cadastrado no sistema.', 409);
    }

    // 2️⃣ Usamos Transação para garantir integridade (User + Employee)
    try {
      return await sequelize.transaction(async (t) => {
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
          tenant_id: tenantId,
          email,
          password_hash: passwordHash,
          role: 'STAFF',
          name: name ?? null,
          phone: phone ?? null,
        }, { transaction: t });

        await Employee.create({
          user_id: user.id,
          role_title: roleTitle,
          is_active: true,
          tenant_id: tenantId,
        }, { transaction: t });

        return user;
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro ao criar staff:', error);
      throw new AppError('Erro ao processar criação de funcionário.', 500);
    }
  }

  static async list(tenantId: string) {
    return User.findAll({
      where: {
        tenant_id: tenantId,
        role: 'STAFF',
      },
      include: [
        {
          model: Employee,
          as: 'employee',
        },
      ],
    });
  }

  static async findOne(employeeId: string) {
    const employee = await Employee.findByPk(employeeId, {
      include: [{ model: User, as: 'user' }],
    });

    if (!employee) {
      throw new AppError('Membro da equipe (Staff) não encontrado.', 404);
    }

    return employee;
  }

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
        // is_active geralmente fica no model Employee ou User, ajuste conforme seu banco
      });

      if (data.roleTitle && user.employee) {
        await user.employee.update({
          role_title: data.roleTitle,
        });
      }

      return user;
    } catch (error) {
      throw new AppError('Erro ao atualizar os dados do staff.', 500);
    }
  }

  static async deactivate(userId: string) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new AppError('Staff não encontrado para desativação.', 404);
    }

    if (user.employee) {
      await user.employee.update({ is_active: false });
    }
    
    // Opcional: desativar o acesso do usuário também
    await user.update({ is_active: false }); 
  }
}