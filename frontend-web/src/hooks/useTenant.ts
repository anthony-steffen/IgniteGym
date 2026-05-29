import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Adicionado
import { api } from '../services/api';
import type { Tenant, UpdateUnitFormData } from '../modules/tenant/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function useTenant() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  const { data: unit, isLoading } = useQuery({
    queryKey: ['tenant', tenantSlug],
    queryFn: async () => {
      const response = await api.get<Tenant>(`/tenants/${tenantSlug}`);
      return response.data;
    },
    enabled: !!tenantSlug,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUnitFormData) => {
      const response = await api.put<Tenant>(`/tenants/${requireSlug()}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantSlug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/tenants/${requireSlug()}`);
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
    hasValidSlug: !!tenantSlug,
    updateUnit: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteUnit: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
}
