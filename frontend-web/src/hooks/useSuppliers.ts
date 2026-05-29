import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Importar useParams
import type { Supplier } from '../modules/supplier/types';
import { api } from '../services/api';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function useSuppliers() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  // 1. LISTAGEM (GET /inventory/:slug/suppliers)
  const suppliersQuery = useQuery<Supplier[]>({
    queryKey: ['inventory-suppliers', tenantSlug],
    queryFn: async () => {
      const response = await api.get(`/inventory/${tenantSlug}/suppliers`);
      return response.data;
    },
    enabled: !!tenantSlug,
    staleTime: 1000 * 60 * 5,
  });

  // 2. CRIAÇÃO (POST /inventory/:slug/suppliers)
  const createSupplierMutation = useMutation({
    mutationFn: async (data: Partial<Supplier>) => {
      const targetSlug = requireSlug();
      return api.post(`/inventory/${targetSlug}/suppliers`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers', tenantSlug] });
    }
  });

  // 3. ATUALIZAÇÃO (PUT /inventory/:slug/suppliers/:id)
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Supplier> & { id: string }) => {
      const targetSlug = requireSlug();
      return api.put(`/inventory/${targetSlug}/suppliers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers', tenantSlug] });
    }
  });

  // 4. DELETAR (DELETE /inventory/:slug/suppliers/:id)
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      const targetSlug = requireSlug();
      return api.delete(`/inventory/${targetSlug}/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers', tenantSlug] });
    }
  });

  return {
    suppliers: suppliersQuery.data ?? [],
    isLoading: suppliersQuery.isLoading,
    isError: suppliersQuery.isError,
    hasValidSlug: !!tenantSlug,
    createSupplier: createSupplierMutation.mutateAsync,
    updateSupplier: updateSupplierMutation.mutateAsync,
    deleteSupplier: deleteSupplierMutation.mutateAsync,
    isUpdating: updateSupplierMutation.isPending,
    isSaving: createSupplierMutation.isPending
  };
}
