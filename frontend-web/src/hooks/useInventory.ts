import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom'; // 👈 Import necessário
import { api } from '../services/api';
import type { Product, CreateProductData, Category } from '../modules/product/types';
import type { Supplier } from '../modules/supplier/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function useInventory() {
  const queryClient = useQueryClient();
  const { slug } = useParams(); // 👈 Captura o slug da URL atual
  const tenantSlug = normalizeTenantSlug(slug);

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  // 1. LISTAGEM (GET /inventory/:slug/products)
  const productsQuery = useQuery<Product[]>({
    queryKey: ['inventory-products', tenantSlug], // 👈 Slug na chave para isolar cache
    queryFn: async () => {
      const response = await api.get(`/inventory/${tenantSlug}/products`); // 👈 Rota corrigida
      return response.data;
    },
    enabled: !!tenantSlug,
  });

  // 2. LISTAGEM (GET /inventory/:slug/categories)
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['inventory-categories', tenantSlug],
    queryFn: async () => {
      const response = await api.get(`/inventory/${tenantSlug}/categories`); // 👈 Rota corrigida
      return response.data;
    },
    enabled: !!tenantSlug,
    staleTime: 1000 * 60 * 10,
  });

  // 3. LISTAGEM (GET /inventory/:slug/suppliers)
  const suppliersQuery = useQuery<Supplier[]>({
    queryKey: ['inventory-suppliers', tenantSlug],
    queryFn: async () => {
      const response = await api.get(`/inventory/${tenantSlug}/suppliers`); // 👈 Rota corrigida
      return response.data;
    },
    enabled: !!tenantSlug,
    staleTime: 1000 * 60 * 10,
  });

  // 4. CRIAÇÃO (POST /inventory/:slug/products)
  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductData) => {
      const targetSlug = requireSlug();
      return api.post(`/inventory/${targetSlug}/products`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', tenantSlug] });
    }
  });

  // 5. ATUALIZAÇÃO (PUT /inventory/:slug/products/:id)
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      const targetSlug = requireSlug();
      return api.put(`/inventory/${targetSlug}/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', tenantSlug] });
    }
  });

  // 6. DELETAR (DELETE /inventory/:slug/products/:id)
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const targetSlug = requireSlug();
      return api.delete(`/inventory/${targetSlug}/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', tenantSlug] });
    }
  });

  // ... restante do retorno (mantido conforme original)
  return {
    products: productsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    suppliers: suppliersQuery.data ?? [],
    isLoading: productsQuery.isLoading || categoriesQuery.isLoading || suppliersQuery.isLoading,
    isError: productsQuery.isError || categoriesQuery.isError || suppliersQuery.isError,
    hasValidSlug: !!tenantSlug,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    isSaving: createProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending
  };
}
