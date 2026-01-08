import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Product, CreateProductData, Category } from '../modules/product/types';

export function useInventory() {
  const queryClient = useQueryClient();

  // Busca de Produtos
  const productsQuery = useQuery<Product[]>({
    queryKey: ['inventory-products'],
    queryFn: async () => {
      const response = await api.get('/inventory/products');
      return response.data;
    }
  });

  // 🚀 BUSCA DE CATEGORIAS (Utilizando sua nova rota /categories)
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // Categorias mudam pouco, cache de 10 min
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      return api.post('/inventory/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      return api.put(`/inventory/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
    }
  });

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
    categories: categoriesQuery.data ?? [], // Disponibiliza categorias para o Modal
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isSaving: createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending
  };
}