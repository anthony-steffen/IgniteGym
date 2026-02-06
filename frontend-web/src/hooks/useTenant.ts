import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Adicionado
import { api } from '../services/api';
import type { Tenant, UpdateUnitFormData } from '../modules/tenant/types';

export function useTenant() {
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const { data: unit, isLoading } = useQuery({
    queryKey: ['tenant', slug],
    queryFn: async () => {
      // Rota normalizada: /tenants/academia-exemplo
      const response = await api.get<Tenant>(`/tenants/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUnitFormData) => {
      // Rota normalizada para update
      const response = await api.put<Tenant>(`/tenants/${slug}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', slug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Rota normalizada para delete
      await api.delete(`/tenants/${slug}`);
    },
    onSuccess: () => {
      // Ao deletar a unidade, limpamos tudo e voltamos pro registro
      localStorage.clear(); 
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