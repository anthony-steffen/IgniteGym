import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export type SalePaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

interface SaleItemPayload {
  productId: string;
  quantity: number;
}

interface CreateSalePayload {
  studentId?: string;
  paymentMethod: SalePaymentMethod;
  items: SaleItemPayload[];
}

export function useSales() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const createSaleMutation = useMutation({
    mutationFn: async (payload: CreateSalePayload) => {
      if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
      const response = await api.post(`/sales/${tenantSlug}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', tenantSlug] });
    },
  });

  return {
    createSale: createSaleMutation.mutateAsync,
    isCreatingSale: createSaleMutation.isPending,
    hasValidSlug: !!tenantSlug,
  };
}
