import { CheckIn } from '../../database/models/checkin.model';
import { Subscription } from '../../database/models/subscription.model';
import { Student } from '../../database/models/student.model';
import { User } from '../../database/models/user.model';
import { AppError } from '../../errors/AppError';

export class CheckinService {
  /**
   * REGISTRAR ENTRADA
   * Valida se o aluno pertence à unidade e se tem matrícula ativa.
   */
  async create(studentId: string, tenantId: string) {
    // 1️⃣ Valida se o aluno existe nesta unidade
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true }
    });

    if (!student) {
      throw new AppError('Aluno não encontrado ou inativo nesta unidade.', 404);
    }

    // 2️⃣ Valida se existe matrícula ativa
    const activeSub = await Subscription.findOne({
      where: { 
        student_id: studentId, 
        tenant_id: tenantId, 
        status: 'ACTIVE' 
      }
    });

    if (!activeSub) {
      throw new AppError('Acesso negado: Aluno sem matrícula ativa.', 403);
    }

    // 3️⃣ Registra o Check-in
    return await CheckIn.create({
      student_id: studentId,
      tenant_id: tenantId,
      subscription_id: activeSub.id
    });
  }

  /**
   * LISTAR TODOS OS CHECK-INS DA UNIDADE (Últimas 24h ou geral)
   */
  async list(tenantId: string) {
    return await CheckIn.findAll({
      where: { tenant_id: tenantId },
      include: [
        { 
          model: Student, 
          as: 'student', 
          include: [{ model: User, as: 'user', attributes: ['name'] }] 
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 100 // Proteção de performance
    });
  }

  /**
   * LISTAR HISTÓRICO DE UM ALUNO ESPECÍFICO
   */
  async listByStudent(studentId: string, tenantId: string) {
    return await CheckIn.findAll({
      where: { student_id: studentId, tenant_id: tenantId },
      order: [['created_at', 'DESC']]
    });
  }
}