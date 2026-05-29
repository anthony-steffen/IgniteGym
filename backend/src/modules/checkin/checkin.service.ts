import { CheckIn } from '../../database/models/checkin.model';
import { Subscription } from '../../database/models/subscription.model';
import { Student } from '../../database/models/student.model';
import { User } from '../../database/models/user.model';
import { AppError } from '../../errors/AppError';

export class CheckinService {
  async create(studentId: string, tenantId: string) {
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      throw new AppError('Aluno nao encontrado ou inativo nesta unidade.', 404);
    }

    const activeSub = await Subscription.findOne({
      where: {
        student_id: studentId,
        tenant_id: tenantId,
        status: 'ACTIVE',
      },
    });

    if (!activeSub) {
      throw new AppError('Acesso negado: aluno sem matricula ativa.', 403);
    }

    if (activeSub.payment_status !== 'PAID') {
      throw new AppError('Acesso negado: pagamento da matricula pendente.', 403);
    }

    return CheckIn.create({
      student_id: studentId,
      tenant_id: tenantId,
      subscription_id: activeSub.id,
    });
  }

  async list(tenantId: string) {
    return CheckIn.findAll({
      where: { tenant_id: tenantId },
      include: [
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 100,
    });
  }

  async listByStudent(studentId: string, tenantId: string) {
    return CheckIn.findAll({
      where: { student_id: studentId, tenant_id: tenantId },
      order: [['created_at', 'DESC']],
    });
  }
}
