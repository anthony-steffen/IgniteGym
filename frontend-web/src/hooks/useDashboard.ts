import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { DashboardResponse } from '../modules/home/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

const EMPTY_DASHBOARD: DashboardResponse = {
  metrics: {
    totalStudents: 0,
    activeSubscriptions: 0,
    checkinsToday: 0,
    pendingPayments: 0,
    newSubscriptionsMonth: 0,
    monthlyRevenue: 0,
  },
  weeklyCheckins: [],
  generatedAt: '',
};

export function useDashboard() {
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const dashboardQuery = useQuery<DashboardResponse>({
    queryKey: ['dashboard', tenantSlug],
    queryFn: async () => {
      const response = await api.get<DashboardResponse>(`/dashboard/${tenantSlug}`);
      return response.data;
    },
    enabled: !!tenantSlug,
    refetchInterval: 60000,
  });

  return {
    dashboard: dashboardQuery.data ?? EMPTY_DASHBOARD,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    hasValidSlug: !!tenantSlug,
  };
}
