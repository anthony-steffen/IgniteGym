import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Tenant, UpdateUnitFormData } from '../modules/tenant/types';

export function useTenant() {
  const queryClient = useQueryClient();

  const { data: unit, isLoading } = useQuery({
    queryKey: ['tenant-me'],
    queryFn: async () => {
      const response = await api.get<Tenant>('/tenants/me');
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUnitFormData) => {
      const response = await api.put<Tenant>('/tenants/update', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-me'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/tenants/terminate');
    },
    onSuccess: () => {
      // Redireciona para o registro ou login após excluir a unidade
      window.location.href = '/register';
    }
  });

  return {
    unit,
    isLoading,
    updateUnit: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteUnit: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
}