// import { Op } from 'sequelize';
import { Subscription } from '../../database/models/subscription.model';
import { Student } from '../../database/models/student.model';
import { Plan } from '../../database/models/plan.model';

import { CreateSubscriptionDTO } from './dtos/create-subscription.dto';
import { CancelSubscriptionDTO } from './dtos/cancel-subscription.dto';

export class SubscriptionService {
  /**
   * Cria uma nova assinatura para um aluno
   */
  async create(data: CreateSubscriptionDTO) {
    const { tenantId, studentId, planId } = data;

    // 1️⃣ valida aluno
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      throw new Error('Aluno não encontrado');
    }

    // 2️⃣ valida plano
    const plan = await Plan.findOne({
      where: { id: planId, tenant_id: tenantId, is_active: true },
    });

    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    // 3️⃣ impede duas assinaturas ativas
    const activeSubscription = await Subscription.findOne({
      where: {
        student_id: studentId,
        status: 'ACTIVE',
      },
    });

    if (activeSubscription) {
      throw new Error('Aluno já possui uma assinatura ativa');
    }

    // 4️⃣ calcula datas
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    // 5️⃣ cria assinatura
    const subscription = await Subscription.create({
      tenant_id: tenantId,
      student_id: studentId,
      plan_id: planId,
      price: plan.price,
      start_date: startDate,
      end_date: endDate,
      status: 'ACTIVE', 
    });

    return subscription;
  }

  /**
   * Lista assinaturas de um aluno
   */
  async listByStudent(studentId: string, tenantId: string) {
    return Subscription.findAll({
      where: {
        student_id: studentId,
        tenant_id: tenantId,
      },
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Cancela uma assinatura
   */
  async cancel(data: CancelSubscriptionDTO) {
    const { subscriptionId, tenantId } = data;

    const subscription = await Subscription.findOne({
      where: { id: subscriptionId, tenant_id: tenantId },
    });

    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new Error('Assinatura já está encerrada');
    }

    subscription.status = 'CANCELED';
    subscription.end_date = new Date();

    await subscription.save();

    return subscription;
  }
}
