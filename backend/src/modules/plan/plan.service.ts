import { Plan } from '../../database/models/plan.model';
import { CreatePlanDTO } from './dtos/create-plan.dto';
import { UpdatePlanDTO } from './dtos/update-plan.dto';
import { ListPlansDTO } from './dtos/list-plans.dto';
import { DeactivatePlanDTO } from './dtos/deactivate-plan.dto';
import { AppError } from '../../errors/AppError';

export class PlanService {
  async create(data: CreatePlanDTO) {
    const { tenantId, name, price, duration_days } = data;

    // 1. Validação de dados de entrada
    if (duration_days <= 0) {
      throw new AppError('A duração do plano deve ser de pelo menos 1 dia.', 400);
    }

    if (price < 0) {
      throw new AppError('O preço do plano não pode ser negativo.', 400);
    }

    // 2. Evita duplicidade de nomes de planos no mesmo tenant
    const planExists = await Plan.findOne({
      where: { tenant_id: tenantId, name }
    });

    if (planExists) {
      throw new AppError('Já existe um plano cadastrado com este nome.', 409);
    }

    try {
      return await Plan.create({
        tenant_id: tenantId,
        name,
        price,
        duration_days,
        is_active: true,
      });
    } catch (error) {
      console.error('❌ Erro ao criar plano:', error);
      throw new AppError('Erro ao salvar o novo plano.', 500);
    }
  }

  async list({ tenantId, onlyActive }: ListPlansDTO) {
    return Plan.findAll({
      where: {
        tenant_id: tenantId,
        ...(onlyActive ? { is_active: true } : {}),
      },
      order: [['created_at', 'DESC']],
    });
  }

  async update(data: UpdatePlanDTO) {
    const plan = await Plan.findOne({
      where: {
        id: data.planId,
        tenant_id: data.tenantId,
      },
    });

    if (!plan) {
      throw new AppError('Plano não encontrado para edição.', 404);
    }

    try {
      await plan.update({
        name: data.name ?? plan.name,
        price: data.price ?? plan.price,
        duration_days: data.duration_days ?? plan.duration_days,
        is_active: data.is_active ?? plan.is_active,
      });

      return plan;
    } catch (error) {
      throw new AppError('Erro ao atualizar os dados do plano.', 500);
    }
  }

  async deactivate(data: DeactivatePlanDTO): Promise<Plan> {
    const { tenantId, planId } = data;

    const plan = await Plan.findOne({
      where: {
        id: planId,
        tenant_id: tenantId,
        is_active: true,
      },
    });

    if (!plan) {
      // 404 porque se já estiver inativo ou não existir, a ação de "desativar" é impossível
      throw new AppError('Plano não encontrado ou já se encontra inativo.', 404);
    }

    try {
      plan.is_active = false;
      await plan.save();

      return plan;
    } catch (error) {
      throw new AppError('Falha ao tentar desativar o plano.', 500);
    }
  }
}
