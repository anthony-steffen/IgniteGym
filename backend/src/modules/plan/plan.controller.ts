import { Request, Response } from 'express';
import { PlanService } from './plan.service';

export class PlanController {
  private service: PlanService;

  constructor() {
    this.service = new PlanService();
  }

  list = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const plans = await this.service.list({ tenantId });
      return res.json(plans);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const plan = await this.service.create({
        ...req.body,
        tenantId,
      });

      return res.status(201).json(plan);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id: planId } = req.params;

      const plan = await this.service.update({
        ...req.body,
        tenantId,
        planId,
      });

      return res.json(plan);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };

  deactivate = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const { id: planId } = req.params;

      await this.service.deactivate({
        tenantId,
        planId,
      });

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
}