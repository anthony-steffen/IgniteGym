import { Student } from '../../database/models/student.model';
import { User } from '../../database/models/user.model';

interface CreateStudentInput {
  tenantId: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: Date;
}

export class StudentService {
  static async create(data: CreateStudentInput) {
    // 1️⃣ evita duplicidade por email no tenant
    if (data.email) {
      const exists = await User.findOne({
        where: {
          tenant_id: data.tenantId,
          email: data.email,
        },
      });

      if (exists) {
        throw new Error('Email já cadastrado neste tenant');
      }
    }

    // 2️⃣ cria usuário
    const user = await User.create({
      tenant_id: data.tenantId,
      email: data.email ?? null,
      role: 'STUDENT',
      name: data.name,
      phone: data.phone ?? null,
      password_hash: 'TEMP', // depois será ajustado
      is_active: true,
    });

    // 3️⃣ cria student
    const student = await Student.create({
      user_id: user.id,
      tenant_id: data.tenantId,
      birth_date: data.birth_date ?? null,
      is_active: true,
    });

    return { user, student };
  }

  static async list(tenantId: string) {
    return Student.findAll({
      where: { tenant_id: tenantId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'is_active'],
        },
      ],
    });
  }

  static async deactivate(studentId: string, tenantId: string) {
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId },
    });

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    student.is_active = false;
    await student.save();

    return student;
  }
}
