import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Supplier } from '../modules/supplier/types';
import { api } from '../services/api';


export function useSuppliers() {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery<Supplier[]>({
    queryKey: ['inventory-suppliers'],
    queryFn: async () => {
      const response = await api.get('/inventory/suppliers');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  const createSupplierMutation = useMutation({
    mutationFn: async (data: Partial<Supplier>) => {
      return api.post('/inventory/suppliers', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers'] });
    }
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Supplier> & { id: string }) => {
      return api.put(`/inventory/suppliers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers'] });
    }
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/inventory/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-suppliers'] });
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