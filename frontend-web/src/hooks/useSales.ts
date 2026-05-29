import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

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

  const createSaleMutation = useMutation({
    mutationFn: async (payload: CreateSalePayload) => {
      const response = await api.post(`/sales/${slug}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products', slug] });
    },
  });

  return {
    createSale: createSaleMutation.mutateAsync,
    isCreatingSale: createSaleMutation.isPending,
  };
}
