import { Op } from 'sequelize';
import { sequelize } from '../../database/sequelize';
import { Subscription } from '../../database/models/subscription.model';
import { Student } from '../../database/models/student.model';
import { Plan } from '../../database/models/plan.model';

import { CreateSubscriptionDTO } from './dtos/create-subscription.dto';
import { CancelSubscriptionDTO } from './dtos/cancel-subscription.dto';
import { ChangePlanDTO } from './dtos/change-plan.dto';
import { AppError } from '../../errors/AppError';

export class SubscriptionService {
  /**
   * CRIAR ASSINATURA
   */
  async create(data: CreateSubscriptionDTO) {
    const { tenantId, studentId, planId } = data;

    // 1️⃣ Valida aluno
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      throw new AppError('Aluno não encontrado ou está inativo.', 404);
    }

    // 2️⃣ Valida plano
    const plan = await Plan.findOne({
      where: { id: planId, tenant_id: tenantId, is_active: true },
    });

    if (!plan) {
      throw new AppError('Plano selecionado não existe ou foi desativado.', 404);
    }

    // 3️⃣ Impede múltiplas assinaturas ativas
    const activeSubscription = await Subscription.findOne({
      where: { tenant_id: tenantId, student_id: studentId, status: 'ACTIVE' },
    });

    if (activeSubscription) {
      throw new AppError('O aluno já possui uma assinatura ativa no momento.', 409);
    }

    // 4️⃣ Calcula datas
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    try {
      // 5️⃣ Cria assinatura
      return await Subscription.create({
        tenant_id: tenantId,
        student_id: studentId,
        plan_id: planId,
        price: plan.price,
        start_date: startDate,
        end_date: endDate,
        status: 'ACTIVE',
      });
    } catch (error) {
      throw new AppError('Erro ao processar a assinatura no banco de dados.', 500);
    }
  }

  /**
   * CANCELAR ASSINATURA
   */
  async cancel(data: CancelSubscriptionDTO) {
    const { subscriptionId, tenantId } = data;

    const subscription = await Subscription.findOne({
      where: { id: subscriptionId, tenant_id: tenantId },
    });

    if (!subscription) {
      throw new AppError('Assinatura não encontrada.', 404);
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Esta assinatura já não está mais ativa.', 400);
    }

    try {
      subscription.status = 'CANCELED';
      subscription.end_date = new Date();
      await subscription.save();

      return subscription;
    } catch (error) {
      throw new AppError('Erro ao cancelar a assinatura.', 500);
    }
  }

  /**
   * TROCA DE PLANO (Com Transação 🛡️)
   */
  async changePlan(data: ChangePlanDTO) {
    const { tenantId, studentId, newPlanId } = data;

    return await sequelize.transaction(async (t) => {
      // 1️⃣ Busca assinatura ativa
      const activeSubscription = await Subscription.findOne({
        where: { tenant_id: tenantId, student_id: studentId, status: 'ACTIVE' },
        transaction: t,
        lock: t.LOCK.UPDATE // Evita mudanças simultâneas
      });

      if (!activeSubscription) {
        throw new AppError('Aluno não possui assinatura ativa para realizar a troca.', 400);
      }

      // 2️⃣ Valida novo plano
      const newPlan = await Plan.findOne({
        where: { id: newPlanId, tenant_id: tenantId, is_active: true },
        transaction: t
      });

      if (!newPlan) {
        throw new AppError('O novo plano selecionado não é válido.', 404);
      }

      // 3️⃣ Encerra assinatura atual
      activeSubscription.status = 'CANCELED';
      activeSubscription.end_date = new Date();
      await activeSubscription.save({ transaction: t });

      // 4️⃣ Cria nova assinatura
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + newPlan.duration_days);

      const newSubscription = await Subscription.create({
        tenant_id: tenantId,
        student_id: studentId,
        plan_id: newPlanId,
        price: newPlan.price,
        start_date: startDate,
        end_date: endDate,
        status: 'ACTIVE',
      }, { transaction: t });

      return {
        previous: activeSubscription,
        current: newSubscription,
      };
    });
  }

  /**
   * EXPIRE SUBSCRIPTIONS (Cron Job)
   */
  async expireSubscriptions() {
    try {
      const now = new Date();
      const [expiredCount] = await Subscription.update(
        { status: 'EXPIRED' },
        {
          where: {
            status: 'ACTIVE',
            end_date: { [Op.lt]: now },
          },
        }
      );
      return expiredCount;
    } catch (error) {
      console.error('❌ Erro no Job de Expiração:', error);
      // Aqui não lançamos AppError pois roda em background, apenas logamos.
      return 0;
    }
  }

  async listByStudent(studentId: string, tenantId: string) {
    return Subscription.findAll({
      where: { student_id: studentId, tenant_id: tenantId },
      order: [['created_at', 'DESC']],
    });
  }
}