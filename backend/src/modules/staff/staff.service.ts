import { User } from '../../database/models/user.model';
import { Employee } from '../../database/models/employee.model';
import { CreateStaffDTO } from './dtos/create-staff.dto';
import { UpdateStaffDTO } from './dtos/update-staff.dto';
import bcrypt from 'bcrypt';

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

    // 1️⃣ verifica se usuário já existe no tenant
    const existingUser = await User.findOne({
      where: { email, tenant_id: tenantId },
    });

    if (existingUser) {
      // não quebra a aplicação
      return existingUser;
    }

    // 2️⃣ cria usuário
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      tenant_id: tenantId,
      email,
      password_hash: passwordHash,
      role: 'STAFF',
      name: name ?? null,
      phone: phone ?? null,

    });

    // 3️⃣ cria vínculo employee
    await Employee.create({
      user_id: user.id,
      role_title: roleTitle,
      is_active: true
    });

    return user;
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

  static async findOne (employeeId: string) {
    const employee = await Employee.findByPk(employeeId, {
      include: [{ model: User, as: 'user' }],
    });

    if (!employee) {
      throw new Error('Staff não encontrado');
    }

    return employee;
  }
   

  static async update(userId: string, data: UpdateStaffDTO) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new Error('Staff não encontrado');
    }

    await user.update({
      name: data.name ?? user.name,
      phone: data.phone ?? user.phone,
      is_active: data.isActive ?? user.is_active,
    });

    if (data.roleTitle && user.employee) {
      await user.employee.update({
        role_title: data.roleTitle,
      });
    }

    return user;
  }

  static async deactivate(userId: string) {
    const user = await User.findByPk(userId, {
      include: [{ model: Employee, as: 'employee' }],
    });

    if (!user) {
      throw new Error('Staff não encontrado');
    }

  }
}
