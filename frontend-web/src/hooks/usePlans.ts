  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { api } from '../services/api';
  import type { Plan } from '../modules/plan/types/index';

  export function usePlans() {
    const queryClient = useQueryClient();

    const plansQuery = useQuery<Plan[]>({
      queryKey: ['plans'],
      queryFn: async () => {
        const response = await api.get('/plans');
        return response.data;
      }
    });

    const createPlanMutation = useMutation({
      mutationFn: async (data: Omit<Plan, 'id'>) => api.post('/plans', data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] })
    });

    const updatePlanMutation = useMutation({
      mutationFn: async (plan: Plan) => api.put(`/plans/${plan.id}`, plan),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] })
    });

    const deletePlanMutation = useMutation({
      mutationFn: async (id: string) => api.delete(`/plans/${id}`),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans'] })
    });

    return {
      plans: plansQuery.data ?? [],
      isLoading: plansQuery.isLoading,
      createPlan: createPlanMutation.mutate,
      updatePlan: updatePlanMutation.mutate,
      deletePlan: deletePlanMutation.mutate
    };
  }