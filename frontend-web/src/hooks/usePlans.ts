import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Importar useParams
import { api } from '../services/api';
import type { Plan } from '../modules/plan/types/index';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function usePlans() {
  
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  // 1. LISTAGEM (GET /plans/:slug)
  const plansQuery = useQuery<Plan[]>({
    queryKey: ['plans', tenantSlug],
    queryFn: async () => {
      const response = await api.get(`/plans/${tenantSlug}`);
      return response.data;
    },
    enabled: !!tenantSlug,
  });

  // 2. CRIAÇÃO (POST /plans/:slug)
  const createPlanMutation = useMutation({
    mutationFn: async (data: Omit<Plan, 'id'>) => api.post(`/plans/${requireSlug()}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', tenantSlug] })
  });

  // 3. ATUALIZAÇÃO (PUT /plans/:slug/:id)
  const updatePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => api.put(`/plans/${requireSlug()}/${plan.id}`, plan),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', tenantSlug] })
  });

  // 4. DELETAR (DELETE /plans/:slug/:id)
  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/plans/${requireSlug()}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', tenantSlug] })
  });

  const reactivatePlanMutation = useMutation({
    mutationFn: async (plan: Plan) =>
      api.put(`/plans/${requireSlug()}/${plan.id}`, {
        ...plan,
        is_active: true,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', tenantSlug] })
  });

  return {
    plans: plansQuery.data ?? [],
    isLoading: plansQuery.isLoading,
    isError: plansQuery.isError,
    hasValidSlug: !!tenantSlug,
    createPlan: createPlanMutation.mutateAsync,
    updatePlan: updatePlanMutation.mutateAsync,
    deletePlan: deletePlanMutation.mutateAsync,
    reactivatePlan: reactivatePlanMutation.mutateAsync
  };
}
