import { sequelize } from '../../database/sequelize';
import { Student } from '../../database/models/student.model';
import { User } from '../../database/models/user.model';
import { Tenant } from '../../database/models/tenant.model';
import { CreateStudentDTO } from './dtos/create-student.dto';
import { AppError } from '../../errors/AppError';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class StudentService {
  private static async generateTemporaryPasswordHash() {
    const temporarySecret = randomBytes(24).toString('hex');
    return bcrypt.hash(temporarySecret, 10);
  }
  
  /**
   * Método auxiliar para converter SLUG em ID
   */
  private static async resolveTenantId(slug: string): Promise<string> {
    const tenant = await Tenant.findOne({ where: { slug } });
    if (!tenant) throw new AppError('Unidade não encontrada.', 404);
    return tenant.id;
  }

  static async create(slug: string, data: CreateStudentDTO) {
    const tenantId = await this.resolveTenantId(slug);
    const name = data.name?.trim();

    if (!name) {
      throw new AppError('Nome do aluno é obrigatório.', 400);
    }

    if (data.email && !isValidEmail(data.email)) {
      throw new AppError('E-mail inválido.', 400);
    }

    if (data.email) {
      const exists = await User.findOne({ where: { email: data.email } });
      if (exists) throw new AppError('Este e-mail já está em uso.', 409);
    }

    try {
      return await sequelize.transaction(async (t) => {
        const password_hash = await this.generateTemporaryPasswordHash();

        const user = await User.create({
          tenant_id: tenantId,
          email: data.email ?? null,
          role: 'STUDENT',
          name,
          phone: data.phone ?? null,
          password_hash,
          is_active: true,
        }, { transaction: t });

        const student = await Student.create({
          user_id: user.id,
          tenant_id: tenantId,
          birth_date: data.birth_date ?? null,
          is_active: true,
        }, { transaction: t });

        return { user, student };
      });
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao processar o cadastro do aluno.', 500);
    }
  }

  static async list(slug: string) {
    const tenantId = await this.resolveTenantId(slug);

    return Student.findAll({
      where: { tenant_id: tenantId, is_active: true },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone', 'is_active'],
      }],
      order: [[ { model: User, as: 'user' }, 'name', 'ASC']]
    });
  }

  static async update(studentId: string, slug: string, data: Partial<CreateStudentDTO>) {
    const tenantId = await this.resolveTenantId(slug);

    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId },
      include: [{ model: User, as: 'user' }]
    });

    if (!student) throw new AppError('Aluno não encontrado.', 404);

    if (data.email && data.email !== student.user?.email) {
      if (!isValidEmail(data.email)) {
        throw new AppError('E-mail inválido.', 400);
      }
      const emailExists = await User.findOne({ where: { email: data.email } });
      if (emailExists) throw new AppError('Este e-mail já está em uso.', 409);
    }

    try {
      return await sequelize.transaction(async (t) => {
        await User.update({
          name: data.name,
          email: data.email,
          phone: data.phone,
        }, { 
          where: { id: student.user_id },
          transaction: t 
        });

        await student.update({
          birth_date: data.birth_date,
        }, { transaction: t });

        return { message: 'Dados atualizados com sucesso.' };
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erro ao atualizar dados do aluno.', 500);
    }
  }

  static async deactivate(studentId: string, slug: string) {
    const tenantId = await this.resolveTenantId(slug);
    
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId },
    });

    if (!student) throw new AppError('Aluno não encontrado.', 404);

    student.is_active = false;
    await student.save();

    await User.update(
      { is_active: false },
      { where: { id: student.user_id } }
    );

    return student;
  }
}
