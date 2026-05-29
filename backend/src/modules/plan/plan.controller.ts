import { Request, Response } from 'express';
import { PlanService } from './plan.service';
import { AppError } from '../../errors/AppError';

function getErrorStatus(error: unknown) {
  return error instanceof AppError ? error.statusCode : 500;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error || error instanceof AppError
    ? error.message
    : 'Erro interno do servidor';
}

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
    } catch (error) {
      return res.status(getErrorStatus(error)).json({ message: getErrorMessage(error) });
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
    } catch (error) {
      return res.status(getErrorStatus(error)).json({ message: getErrorMessage(error) });
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
    } catch (error) {
      return res.status(getErrorStatus(error)).json({ message: getErrorMessage(error) });
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
    } catch (error) {
      return res.status(getErrorStatus(error)).json({ message: getErrorMessage(error) });
    }
  };
}
