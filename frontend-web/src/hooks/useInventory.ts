import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Product, CreateProductData, StockMovementData } from '../modules/product/types';

export function useInventory() {
  const queryClient = useQueryClient();

  // Listagem de produtos (Backend extrai tenantId do token)
  const productsQuery = useQuery<Product[]>({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      const response = await api.get('/inventory/products');
      return response.data;
    }
  });

  // Criar novo produto
  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      return api.post('/inventory/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    }
  });

  // Atualizar dados básicos do produto (Edição)
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product>) => {
      return api.put(`/inventory/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    }
  });

  // Movimentação de estoque (Entrada/Saída)
  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, ...data }: StockMovementData) => {
      return api.post(`/inventory/products/${productId}/stock`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    }
  });

  // Deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/inventory/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    }
  });

  return {
    products: productsQuery.data ?? [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    updateStock: updateStockMutation.mutateAsync,
    isSaving: 
      createProductMutation.isPending || 
      updateProductMutation.isPending || 
      deleteProductMutation.isPending ||
      updateStockMutation.isPending
  };
}