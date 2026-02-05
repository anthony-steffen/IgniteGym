import { Op } from 'sequelize';
import { sequelize } from '../../database/sequelize';
import { Subscription } from '../../database/models/subscription.model';
import { Student } from '../../database/models/student.model';
import { Plan } from '../../database/models/plan.model';
import { AppError } from '../../errors/AppError';

export class SubscriptionService {
  /**
   * LISTAR MATRÍCULAS
   * Pode listar todas da unidade ou filtrar por aluno
   */
  async list(tenantId: string, studentId?: string) {
    const where: any = { tenant_id: tenantId };
    if (studentId) where.student_id = studentId;

    return await Subscription.findAll({
      where,
      include: [
        { association: 'student', include: ['user'] }, // Assume associação configurada
        { association: 'plan' }
      ],
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * CRIAR ASSINATURA (Matricular Aluno)
   */
  async create(data: any) {
    const { tenantId, studentId, planId } = data;

    // 1️⃣ Valida aluno dentro do tenant
    const student = await Student.findOne({
      where: { id: studentId, tenant_id: tenantId, is_active: true },
    });

    if (!student) {
      throw new AppError('Aluno não encontrado, inativo ou pertence a outra unidade.', 404);
    }

    // 2️⃣ Valida plano dentro do tenant
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
      throw new AppError('O aluno já possui uma assinatura ativa nesta unidade.', 409);
    }

    // 4️⃣ Calcula datas baseadas na duração do plano
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration_days);

    try {
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
      throw new AppError('Erro ao processar a matrícula no banco de dados.', 500);
    }
  }

  /**
   * ATUALIZAR / TROCAR PLANO (Com Transação 🛡️)
   * Renormalizado para o método 'update' do Controller
   */
  async update(id: string, tenantId: string, data: any) {
    const { newPlanId } = data;

    return await sequelize.transaction(async (t) => {
      // 1️⃣ Busca assinatura específica garantindo o tenant
      const subscription = await Subscription.findOne({
        where: { id, tenant_id: tenantId, status: 'ACTIVE' },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!subscription) {
        throw new AppError('Assinatura ativa não encontrada para alteração.', 404);
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
      await subscription.update({
        status: 'CANCELED',
        end_date: new Date()
      }, { transaction: t });

      // 4️⃣ Cria nova assinatura vinculada
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + newPlan.duration_days);

      return await Subscription.create({
        tenant_id: tenantId,
        student_id: subscription.student_id,
        plan_id: newPlanId,
        price: newPlan.price,
        start_date: startDate,
        end_date: endDate,
        status: 'ACTIVE',
      }, { transaction: t });
    });
  }

  /**
   * CANCELAR MATRÍCULA
   */
  async cancel(id: string, tenantId: string) {
    const subscription = await Subscription.findOne({
      where: { id, tenant_id: tenantId },
    });

    if (!subscription) {
      throw new AppError('Assinatura não encontrada nesta unidade.', 404);
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Esta assinatura já não está mais ativa.', 400);
    }

    try {
      return await subscription.update({
        status: 'CANCELED',
        end_date: new Date()
      });
    } catch (error) {
      throw new AppError('Erro ao cancelar a assinatura.', 500);
    }
  }

  /**
   * EXPIRE SUBSCRIPTIONS (Rotina Automática)
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
      return 0;
    }
  }
}