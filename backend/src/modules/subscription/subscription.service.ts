import { Op } from 'sequelize';
import { sequelize } from '../../database/sequelize';
import { Subscription } from '../../database/models/subscription.model';
import { Student } from '../../database/models/student.model';
import { Plan } from '../../database/models/plan.model';
import { CheckIn } from '../../database/models/checkin.model';
import { AppError } from '../../errors/AppError';

type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

const VALID_PAYMENT_STATUS: PaymentStatus[] = ['PAID', 'PENDING', 'OVERDUE'];

function normalizePaymentStatus(value?: string): PaymentStatus {
  if (!value) return 'PAID';
  if (!VALID_PAYMENT_STATUS.includes(value as PaymentStatus)) {
    throw new AppError('Status de pagamento invalido.', 400);
  }
  return value as PaymentStatus;
}

export class SubscriptionService {
  async list(tenantId: string, studentId?: string) {
    const where: Record<string, string> = { tenant_id: tenantId };
    if (studentId) where.student_id = studentId;

    return Subscription.findAll({
      where,
      include: [
        { association: 'student', include: ['user'] },
        { association: 'plan' },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async create(data: {
    tenantId: string;
    studentId: string;
    planId: string;
    paymentStatus?: string;
  }) {
    const { tenantId, studentId, planId, paymentStatus } = data;

    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      throw new AppError('Aluno nao encontrado, inativo ou de outra unidade.', 404);
    }

    const plan = await Plan.findOne({
      where: { id: planId, tenant_id: tenantId, is_active: true },
    });

    if (!plan) {
      throw new AppError('Plano selecionado nao existe ou esta inativo.', 404);
    }

    const activeSubscription = await Subscription.findOne({
      where: { tenant_id: tenantId, student_id: studentId, status: 'ACTIVE' },
    });

    if (activeSubscription) {
      throw new AppError('O aluno ja possui uma matricula ativa nesta unidade.', 409);
    }

    const resolvedPaymentStatus = normalizePaymentStatus(paymentStatus);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    return Subscription.create({
      tenant_id: tenantId,
      student_id: studentId,
      plan_id: planId,
      price: plan.price,
      start_date: startDate,
      end_date: endDate,
      next_due_date: endDate,
      payment_status: resolvedPaymentStatus,
      last_payment_at: resolvedPaymentStatus === 'PAID' ? new Date() : null,
      status: 'ACTIVE',
    });
  }

  async update(id: string, tenantId: string, data: { newPlanId: string }) {
    const { newPlanId } = data;

    return sequelize.transaction(async (t) => {
      const subscription = await Subscription.findOne({
        where: { id, tenant_id: tenantId, status: 'ACTIVE' },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!subscription) {
        throw new AppError('Matricula ativa nao encontrada para alteracao.', 404);
      }

      const newPlan = await Plan.findOne({
        where: { id: newPlanId, tenant_id: tenantId, is_active: true },
        transaction: t,
      });

      if (!newPlan) {
        throw new AppError('O novo plano selecionado nao e valido.', 404);
      }

      await subscription.update(
        {
          status: 'CANCELED',
          end_date: new Date(),
        },
        { transaction: t }
      );

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + newPlan.duration_days);

      return Subscription.create(
        {
          tenant_id: tenantId,
          student_id: subscription.student_id,
          plan_id: newPlanId,
          price: newPlan.price,
          start_date: startDate,
          end_date: endDate,
          next_due_date: endDate,
          payment_status: 'PAID',
          last_payment_at: new Date(),
          status: 'ACTIVE',
        },
        { transaction: t }
      );
    });
  }

  async reactivate(
    id: string,
    tenantId: string,
    data?: { planId?: string; paymentStatus?: string }
  ) {
    const previousSubscription = await Subscription.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!previousSubscription) {
      throw new AppError('Matricula nao encontrada nesta unidade.', 404);
    }

    if (previousSubscription.status === 'ACTIVE') {
      throw new AppError('Esta matricula ja esta ativa.', 400);
    }

    const student = await Student.findOne({
      where: {
        id: previousSubscription.student_id,
        tenant_id: tenantId,
        is_active: true,
      },
    });

    if (!student) {
      throw new AppError('Aluno nao encontrado ou inativo nesta unidade.', 404);
    }

    const activeSubscription = await Subscription.findOne({
      where: {
        tenant_id: tenantId,
        student_id: previousSubscription.student_id,
        status: 'ACTIVE',
      },
    });

    if (activeSubscription) {
      throw new AppError('O aluno ja possui uma matricula ativa nesta unidade.', 409);
    }

    const targetPlanId = data?.planId || previousSubscription.plan_id;
    const plan = await Plan.findOne({
      where: { id: targetPlanId, tenant_id: tenantId, is_active: true },
    });

    if (!plan) {
      throw new AppError('Plano selecionado nao existe ou esta inativo.', 404);
    }

    const resolvedPaymentStatus = normalizePaymentStatus(
      data?.paymentStatus || previousSubscription.payment_status
    );
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    return Subscription.create({
      tenant_id: tenantId,
      student_id: previousSubscription.student_id,
      plan_id: plan.id,
      price: plan.price,
      start_date: startDate,
      end_date: endDate,
      next_due_date: endDate,
      payment_status: resolvedPaymentStatus,
      last_payment_at: resolvedPaymentStatus === 'PAID' ? new Date() : null,
      status: 'ACTIVE',
    });
  }

  async cancel(id: string, tenantId: string) {
    const subscription = await Subscription.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!subscription) {
      throw new AppError('Matricula nao encontrada nesta unidade.', 404);
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Esta matricula nao esta mais ativa.', 400);
    }

    return subscription.update({
      status: 'CANCELED',
      end_date: new Date(),
    });
  }

  async remove(id: string, tenantId: string) {
    const subscription = await Subscription.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!subscription) {
      throw new AppError('Matricula nao encontrada nesta unidade.', 404);
    }

    if (subscription.status === 'ACTIVE') {
      throw new AppError('Cancele a matricula antes de excluir permanentemente.', 400);
    }

    const hasCheckins = await CheckIn.count({
      where: { subscription_id: id, tenant_id: tenantId },
    });

    if (hasCheckins > 0) {
      throw new AppError('Nao e possivel excluir matricula com check-ins vinculados.', 400);
    }

    await subscription.destroy();
  }

  async updatePaymentStatus(id: string, tenantId: string, paymentStatus: string) {
    const subscription = await Subscription.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!subscription) {
      throw new AppError('Matricula nao encontrada nesta unidade.', 404);
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Somente matriculas ativas podem ter pagamento atualizado.', 400);
    }

    const resolvedPaymentStatus = normalizePaymentStatus(paymentStatus);

    return subscription.update({
      payment_status: resolvedPaymentStatus,
      last_payment_at: resolvedPaymentStatus === 'PAID' ? new Date() : subscription.last_payment_at,
    });
  }

  async expireSubscriptions() {
    const now = new Date();
    const [expiredCount] = await Subscription.update(
      { status: 'EXPIRED', payment_status: 'OVERDUE' },
      {
        where: {
          status: 'ACTIVE',
          end_date: { [Op.lt]: now },
        },
      }
    );

    return expiredCount;
  }
}
