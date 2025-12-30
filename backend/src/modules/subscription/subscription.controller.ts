import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDTO } from './dtos/create-subscription.dto';
// import { CancelSubscriptionDTO } from './dtos/cancel-subscription.dto';

export class SubscriptionController {
  private service = new SubscriptionService();

  /**
   * POST /subscriptions
   */
  async create(req: Request, res: Response) {
    const { tenantId } = req.user!;
    const { studentId, planId } = req.body as CreateSubscriptionDTO;

    const subscription = await this.service.create({
      tenantId,
      studentId,
      planId,
    });

    return res.status(201).json(subscription);
  }

  /**
   * GET /students/:studentId/subscriptions
   */
  async listByStudent(req: Request, res: Response) {
    const { tenantId } = req.user!;
    const { studentId } = req.params;

    const subscriptions = await this.service.listByStudent(
      studentId,
      tenantId
    );
    
    return res.json(subscriptions);
  }

  /**
   * DELETE /subscriptions/:id
   */
  async cancel(req: Request, res: Response) {
    const { tenantId } = req.user!;
    const { id } = req.params;

    await this.service.cancel({
      subscriptionId: id,
      tenantId,
    });

    return res.status(204).send();
  }
}
