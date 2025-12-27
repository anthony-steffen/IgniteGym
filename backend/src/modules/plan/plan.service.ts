import { Plan } from '../../database/models/plan.model';
import { CreatePlanDTO } from './dtos/create-plan.dto';
import { UpdatePlanDTO } from './dtos/update-plan.dto';
import { ListPlansDTO } from './dtos/list-plans.dto';
import { DeactivatePlanDTO } from './dtos/deactivate-plan.dto';

export class PlanService {
  async create(data: CreatePlanDTO) {
    const { tenantId, name, price, duration_days } = data;

    if (duration_days <= 0) {
      throw new Error('Duração inválida');
    }

    return Plan.create({
      tenant_id: tenantId,
      name,
      price,
      duration_days,
      is_active: true,
    });
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
      throw new Error('Plano não encontrado');
    }

    await plan.update({
      name: data.name ?? plan.name,
      price: data.price ?? plan.price,
      duration_days: data.duration_days ?? plan.duration_days,
      is_active: data.is_active ?? plan.is_active,
    });

    return plan;
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
      throw new Error('Plano não encontrado ou já inativo');
    }

    plan.is_active = false;
    await plan.save();

    return plan;
  }
}
