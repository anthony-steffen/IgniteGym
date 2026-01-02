import { sequelize } from '../../database/sequelize';
import { Student } from '../../database/models/student.model';
import { User } from '../../database/models/user.model';
import { CreateStudentDTO } from './dtos/create-student.dto';
import { AppError } from '../../errors/AppError';

export class StudentService {
  static async create(data: CreateStudentDTO) {
    // 1️⃣ Evita duplicidade por email
    if (data.email) {
      const exists = await User.findOne({
        where: { email: data.email },
      });

      if (exists) {
        throw new AppError('Este e-mail já está em uso por outro usuário.', 409);
      }
    }

    try {
      // 2️⃣ Transação para garantir que User e Student existam juntos
      return await sequelize.transaction(async (t) => {
        const user = await User.create({
          tenant_id: data.tenantId,
          email: data.email ?? null,
          role: 'STUDENT',
          name: data.name,
          phone: data.phone ?? null,
          password_hash: 'TEMP', // Recomendado: Gerar um hash aleatório aqui
          is_active: true,
        }, { transaction: t });

        const student = await Student.create({
          user_id: user.id,
          tenant_id: data.tenantId,
          birth_date: data.birth_date ?? null,
          is_active: true,
        }, { transaction: t });

        return { user, student };
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('❌ Erro ao criar aluno:', error);
      throw new AppError('Erro ao processar o cadastro do aluno.', 500);
    }
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
      order: [[ { model: User, as: 'user' }, 'name', 'ASC']] // Ordenar por nome do usuário
    });
  }

  static async deactivate(studentId: string, tenantId: string) {
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId },
    });

    if (!student) {
      throw new AppError('Aluno não encontrado para desativação.', 404);
    }

    try {
      student.is_active = false;
      await student.save();

      // Opcional: Desativar também o acesso do usuário
      await User.update(
        { is_active: false },
        { where: { id: student.user_id } }
      );

      return student;
    } catch (error) {
      throw new AppError('Erro ao tentar desativar o registro do aluno.', 500);
    }
  }
}