// src/modules/checkin/checkin.service.ts
import { Op } from 'sequelize';
import { CheckIn } from '../../database/models/checkin.model';
import { Student } from '../../database/models/student.model';
import { Subscription } from '../../database/models/subscription.model';

import { AppError } from '../../errors/AppError';

export class CheckInService {
  async create(tenantId: string, studentId: string) {
    // 1️⃣ Valida se o aluno existe e pertence a esta academia (tenant)
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      // 404 porque o recurso (aluno ativo) não foi encontrado para este tenant
      throw new AppError('Aluno não encontrado ou inativo', 404);
    }

    // 2️⃣ Valida assinatura ativa
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
      // 403 Forbidden: O usuário é reconhecido, mas não tem permissão (assinatura)
      throw new AppError('Acesso negado: Aluno sem assinatura ativa ou plano expirado', 403);
    }

    // 3️⃣ Impede múltiplos check-ins no mesmo dia
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
      // 409 Conflict: O recurso já existe para o período solicitado
      throw new AppError('Check-in já realizado hoje', 409);
    }

    // 4️⃣ Cria o check-in
    try {
      return await CheckIn.create({
        tenant_id: tenantId,
        student_id: studentId,
        subscription_id: subscription.id,
        checked_in_at: new Date(),
      });
    } catch (error) {
      console.error('❌ Erro ao salvar check-in:', error);
      throw new AppError('Erro ao registrar check-in no banco de dados', 500);
    }
  }

  async listByStudent(tenantId: string, studentId: string) {
    // Aqui não costumamos lançar erro se a lista estiver vazia, apenas retornamos []
    return CheckIn.findAll({
      where: { tenant_id: tenantId, student_id: studentId },
      order: [['checked_in_at', 'DESC']],
    });
  }
}