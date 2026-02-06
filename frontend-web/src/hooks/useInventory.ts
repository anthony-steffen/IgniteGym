import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Import necessário
import { api } from '../services/api';
import type { Product, CreateProductData, Category } from '../modules/product/types';
import type { Supplier } from '../modules/supplier/types';

export function useInventory() {
  const queryClient = useQueryClient();
  const { slug } = useParams(); // 👈 Captura o slug da URL atual

  // 1. LISTAGEM (GET /inventory/:slug/products)
  const productsQuery = useQuery<Product[]>({
    queryKey: ['inventory-products', slug], // 👈 Slug na chave para isolar cache
    queryFn: async () => {
      const response = await api.get(`/inventory/${slug}/products`); // 👈 Rota corrigida
      return response.data;
    },
    enabled: !!slug, // 👈 Previne o erro 'undefined' bloqueando a execução sem slug
  });

  // 2. LISTAGEM (GET /inventory/:slug/categories)
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['inventory-categories', slug],
    queryFn: async () => {
      const response = await api.get(`/inventory/${slug}/categories`); // 👈 Rota corrigida
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  // 3. LISTAGEM (GET /inventory/:slug/suppliers)
  const suppliersQuery = useQuery<Supplier[]>({
    queryKey: ['inventory-suppliers', slug],
    queryFn: async () => {
      const response = await api.get(`/inventory/${slug}/suppliers`); // 👈 Rota corrigida
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  });

  // 4. CRIAÇÃO (POST /inventory/:slug/products)
  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      return api.post(`/inventory/${slug}/products`, data); // 👈 POST corrigido
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', slug] });
    }
  });

  // 5. ATUALIZAÇÃO (PUT /inventory/:slug/products/:id)
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      return api.put(`/inventory/${slug}/products/${id}`, data); // 👈 PUT corrigido
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', slug] });
    }
  });

  // 6. DELETAR (DELETE /inventory/:slug/products/:id)
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/inventory/${slug}/products/${id}`); // 👈 DELETE corrigido
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', slug] });
    }
  });

  // ... restante do retorno (mantido conforme original)
  return {
    products: productsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    suppliers: suppliersQuery.data ?? [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading || suppliersQuery.isLoading,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isSaving: createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending
  };
}