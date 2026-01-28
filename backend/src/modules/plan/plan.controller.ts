import { Request, Response } from 'express';
import { PlanService } from './plan.service';
import { getTenantId } from '../../utils/getTenantId';

export class PlanController {
  private service: PlanService;

  constructor() {
    this.service = new PlanService();
  }

  list = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req) || (req.query.tenantId as string);
    const plans = await this.service.list({ tenantId: tenantId as string });
    return res.json(plans);
  };

  create = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req) || (req.body.tenantId as string) || null;
    const plan = await this.service.create({
      tenantId: tenantId as any, // Usamos any ou o tipo correto do seu DTO se permitir null
      ...req.body,
    });

    return res.status(201).json(plan);
  };

  update = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req) || (req.body.tenantId as string);
    const { id: planId } = req.params;

    // Se não for plano global, o tenantId é obrigatório para segurança
    const plan = await this.service.update({
      tenantId: tenantId as string,
      planId,
      ...req.body,
    });

    return res.json(plan);
  };

  deactivate = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req) || (req.query.tenantId as string);
    const { id: planId } = req.params;

    await this.service.deactivate({
      tenantId: tenantId as string,
      planId,
    });

    return res.status(204).send();
  };
}