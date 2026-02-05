import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { AppError } from '../../errors/AppError';

export class SubscriptionController {
  private service: SubscriptionService;

  constructor() {
    this.service = new SubscriptionService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      
      const subscription = await this.service.create({
        ...req.body,
        tenantId
      });

      return res.status(201).json(subscription);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const tenantId = req.tenantId as string;
      const subscriptions = await this.service.list(tenantId);
      return res.json(subscriptions);
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId as string;

      const subscription = await this.service.update(id, tenantId, req.body);
      return res.json(subscription);
    } catch (error: any) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      return res.status(statusCode).json({ status: "error", message: error.message });
    }
  };

  cancel = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tenantId = req.tenantId as string;

      await this.service.cancel(id, tenantId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ status: "error", message: error.message });
    }
  };
}