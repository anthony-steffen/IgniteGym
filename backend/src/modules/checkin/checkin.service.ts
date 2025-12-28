// src/modules/checkin/checkin.service.ts
import { Op } from 'sequelize';
import { CheckIn } from '../../database/models/checkin.model';
import { Student } from '../../database/models/student.model';
import { Subscription } from '../../database/models/subscription.model';

export class CheckInService {
  static async create(tenantId: string, studentId: string) {
    // 1️⃣ valida aluno
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      throw new Error('Aluno não encontrado ou inativo');
    }

    // 2️⃣ assinatura ativa
    const subscription = await Subscription.findOne({
      where: {
        student_id: studentId,
        tenant_id: tenantId,
        status: 'ACTIVE',
        end_date: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!subscription) {
      throw new Error('Aluno sem assinatura ativa');
    }

    // 3️⃣ impede múltiplos check-ins no mesmo dia
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const alreadyCheckedIn = await CheckIn.findOne({
      where: {
        student_id: studentId,
        checked_in_at: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    if (alreadyCheckedIn) {
      throw new Error('Check-in já realizado hoje');
    }

    // 4️⃣ cria check-in
    return CheckIn.create({
      tenant_id: tenantId,
      student_id: studentId,
      subscription_id: subscription.id,
      checked_in_at: new Date(),
    });
  }

  static async listByStudent(tenantId: string, studentId: string) {
    return CheckIn.findAll({
      where: { tenant_id: tenantId, student_id: studentId },
      order: [['checked_in_at', 'DESC']],
    });
  }
}
