// src/jobs/subscription-expiration.job.ts
import cron from 'node-cron';
import { SubscriptionService } from '../modules/subscription/subscription.service';

const subscriptionService = new SubscriptionService();

/**
 * ⏰ Executa todos os dias às 00:05
 * Expira assinaturas vencidas
 */
export function startSubscriptionExpirationJob() {
  cron.schedule('5 0 * * *', async () => {
    console.log('🕒 CRON: verificando assinaturas vencidas');

    try {
      const result = await subscriptionService.expireSubscriptions();
      console.log('✅ Assinaturas expiradas:', result);
    } catch (err) {
      console.error('❌ Erro no job de expiração:', err);
    }
  });
}
