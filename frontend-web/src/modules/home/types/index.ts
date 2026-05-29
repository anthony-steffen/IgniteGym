export interface DashboardMetrics {
  totalStudents: number;
  activeSubscriptions: number;
  checkinsToday: number;
  pendingPayments: number;
  newSubscriptionsMonth: number;
  monthlyRevenue: number;
}

export interface WeeklyCheckinPoint {
  label: string;
  total: number;
  date: string;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  weeklyCheckins: WeeklyCheckinPoint[];
  generatedAt: string;
}
