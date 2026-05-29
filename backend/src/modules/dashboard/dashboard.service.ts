import { Op } from 'sequelize';
import { Student } from '../../database/models/student.model';
import { CheckIn } from '../../database/models/checkin.model';
import { Subscription } from '../../database/models/subscription.model';
import { Sale } from '../../database/models/sale.model';

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function formatWeekday(date: Date) {
  const label = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
  return label.replace('.', '').slice(0, 3);
}

export class DashboardService {
  async getTenantDashboard(tenantId: string) {
    const now = new Date();
    const dayStart = startOfDay(now);
    const dayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);

    const [
      totalStudents,
      activeSubscriptions,
      checkinsTodayRaw,
      pendingPayments,
      newSubscriptionsMonth,
      monthlySalesRevenueRaw,
      monthlySubscriptionsRevenueRaw,
    ] =
      await Promise.all([
        Student.count({ where: { tenant_id: tenantId, is_active: true } }),
        Subscription.count({ where: { tenant_id: tenantId, status: 'ACTIVE' } }),
        CheckIn.count({
          where: {
            tenant_id: tenantId,
            created_at: { [Op.between]: [dayStart, dayEnd] },
          } as any,
        }),
        Subscription.count({
          where: {
            tenant_id: tenantId,
            status: 'ACTIVE',
            payment_status: { [Op.in]: ['PENDING', 'OVERDUE'] },
          },
        }),
        Subscription.count({
          where: {
            tenant_id: tenantId,
            created_at: { [Op.gte]: monthStart },
          } as any,
        }),
        Sale.sum('total_value', {
          where: {
            tenant_id: tenantId,
            created_at: { [Op.gte]: monthStart },
          } as any,
        }),
        Subscription.sum('price', {
          where: {
            tenant_id: tenantId,
            payment_status: 'PAID',
            [Op.or]: [
              { last_payment_at: { [Op.gte]: monthStart } },
              {
                // fallback para registros antigos com pagamento em dia e sem last_payment_at preenchido
                last_payment_at: null,
                created_at: { [Op.gte]: monthStart },
              },
            ],
          } as any,
        }),
      ]);

    const monthlySalesRevenue = Number(monthlySalesRevenueRaw || 0);
    const monthlySubscriptionsRevenue = Number(monthlySubscriptionsRevenueRaw || 0);

    const weekDays = Array.from({ length: 7 }, (_, idx) => {
      const target = new Date(now);
      target.setDate(now.getDate() - (6 - idx));
      return target;
    });

    const weeklyCheckinCounts = await Promise.all(
      weekDays.map((target) =>
        CheckIn.count({
          where: {
            tenant_id: tenantId,
            created_at: { [Op.between]: [startOfDay(target), endOfDay(target)] },
          } as any,
        })
      )
    );

    const weeklyCheckins = weekDays.map((target, index) => ({
      label: formatWeekday(target).toUpperCase(),
      total: Number(weeklyCheckinCounts[index]),
      date: target.toISOString().slice(0, 10),
    }));

    return {
      metrics: {
        totalStudents,
        activeSubscriptions,
        checkinsToday: Number(checkinsTodayRaw),
        pendingPayments,
        newSubscriptionsMonth,
        monthlyRevenue: monthlySalesRevenue + monthlySubscriptionsRevenue,
      },
      weeklyCheckins,
      generatedAt: now.toISOString(),
    };
  }
}
