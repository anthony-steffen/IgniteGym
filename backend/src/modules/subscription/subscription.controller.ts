import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDTO } from './dtos/create-subscription.dto';

export class SubscriptionController {
  private service = new SubscriptionService();

  /**
   * POST /subscriptions
   */
  async create(req: Request, res: Response) {
    // Se for Admin, tenta pegar o tenantId do body
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID é obrigatório para criar assinatura.' });
    }

    const { studentId, planId } = req.body as CreateSubscriptionDTO;

    const subscription = await this.service.create({
      tenantId: tenantId as string,
      studentId,
      planId,
    });

    return res.status(201).json(subscription);
  }

  /**
   * GET /students/:studentId/subscriptions
   */
  async listByStudent(req: Request, res: Response) {
    // Busca do token ou da query (para Super-Admin)
    const tenantId = req.user?.tenantId || (req.query.tenantId as string);

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID não identificado.' });
    }

    const { studentId } = req.params;

    const subscriptions = await this.service.listByStudent(
      studentId,
      tenantId as string
    );
    
    return res.json(subscriptions);
  }

  /**
   * DELETE /subscriptions/:id
   */
  async cancel(req: Request, res: Response) {
    const tenantId = req.user?.tenantId || (req.body.tenantId as string);
    const { id } = req.params;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID necessário para cancelamento.' });
    }

    await this.service.cancel({
      subscriptionId: id,
      tenantId: tenantId as string,
    });

    return res.status(204).send();
  }
}