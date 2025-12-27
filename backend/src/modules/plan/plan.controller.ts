import { Request, Response } from 'express';
import { PlanService } from './plan.service';
import { getTenantId } from '../../utils/getTenantId';

export class PlanController {
  private service: PlanService;

  constructor() {
    this.service = new PlanService();
  }

  list = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);

    const plans = await this.service.list({ tenantId });
    return res.json(plans);
  };

  create = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);

    const plan = await this.service.create({
      tenantId,
      ...req.body,
    });

    return res.status(201).json(plan);
  };

  update = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);

    const plan = await this.service.update({
      tenantId,
      planId: req.params.id,
      ...req.body,
    });

    return res.json(plan);
  };

  deactivate = async (req: Request, res: Response) => {
    const tenantId = getTenantId(req);

    await this.service.deactivate({
      tenantId,
      planId: req.params.id,
    });

    return res.status(204).send();
  };
}
