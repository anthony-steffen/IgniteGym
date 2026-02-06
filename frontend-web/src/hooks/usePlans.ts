import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Importar useParams
import { api } from '../services/api';
import type { Plan } from '../modules/plan/types/index';

export function usePlans() {
  
  const queryClient = useQueryClient();
  const { slug } = useParams();

  // 1. LISTAGEM (GET /plans/:slug)
  const plansQuery = useQuery<Plan[]>({
    queryKey: ['plans', slug],
    queryFn: async () => {
      // Ajuste para a rota segmentada conforme padrão do backend
      const response = await api.get(`/plans/${slug}`); 
      return response.data;
    },
    enabled: !!slug,
  });

  // 2. CRIAÇÃO (POST /plans/:slug)
  const createPlanMutation = useMutation({
    mutationFn: async (data: Omit<Plan, 'id'>) => api.post(`/plans/${slug}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', slug] })
  });

  // 3. ATUALIZAÇÃO (PUT /plans/:slug/:id)
  const updatePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => api.put(`/plans/${slug}/${plan.id}`, plan),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', slug] })
  });

  // 4. DELETAR (DELETE /plans/:slug/:id)
  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/plans/${slug}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['plans', slug] })
  });

  return {
    plans: plansQuery.data ?? [],
    isLoading: plansQuery.isLoading,
    createPlan: createPlanMutation.mutate,
    updatePlan: updatePlanMutation.mutate,
    deletePlan: deletePlanMutation.mutate
  };
}