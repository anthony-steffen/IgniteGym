import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Importar useParams
import type { Supplier } from '../modules/supplier/types';
import { api } from '../services/api';

export function useSuppliers() {
  const queryClient = useQueryClient();
  const { slug } = useParams(); 

  // 1. LISTAGEM (GET /inventory/:slug/suppliers)
  const suppliersQuery = useQuery<Supplier[]>({
    queryKey: ['inventory-suppliers', slug],
    queryFn: async () => {
      const response = await api.get(`/inventory/${slug}/suppliers`);
      return response.data;
    },
    enabled: !!slug, // 👈 Bloqueia a execução se o slug estiver undefined
    staleTime: 1000 * 60 * 5,
  });

  // 2. CRIAÇÃO (POST /inventory/:slug/suppliers)
  const createSupplierMutation = useMutation({
    mutationFn: async (data: Partial<Supplier>) => {
      return api.post(`/inventory/${slug}/suppliers`, data); // 👈 POST segmentado
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers', slug] });
    }
  });

  // 3. ATUALIZAÇÃO (PUT /inventory/:slug/suppliers/:id)
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Supplier> & { id: string }) => {
      return api.put(`/inventory/${slug}/suppliers/${id}`, data); // 👈 PUT segmentado
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers', slug] });
    }
  });

  // 4. DELETAR (DELETE /inventory/:slug/suppliers/:id)
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/inventory/${slug}/suppliers/${id}`); // 👈 DELETE segmentado
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers', slug] });
    }
  });

  return {
    suppliers: suppliersQuery.data ?? [],
    isLoading: suppliersQuery.isLoading,
    createSupplier: createSupplierMutation.mutateAsync,
    updateSupplier: updateSupplierMutation.mutateAsync,
    deleteSupplier: deleteSupplierMutation.mutateAsync,
    isUpdating: updateSupplierMutation.isPending,
    isSaving: createSupplierMutation.isPending
  };
}