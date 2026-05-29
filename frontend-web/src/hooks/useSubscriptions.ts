import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { CreateSubscriptionPayload, PaymentStatus, Subscription } from '../modules/subscription/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function useSubscriptions() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  const subscriptionsQuery = useQuery<Subscription[]>({
    queryKey: ['subscriptions', tenantSlug],
    queryFn: async () => {
      const response = await api.get<Subscription[]>(`/subscriptions/${tenantSlug}`);
      return response.data;
    },
    enabled: !!tenantSlug,
  });

  const createSubscription = useMutation({
    mutationFn: async (data: CreateSubscriptionPayload) => {
      return api.post(`/subscriptions/${requireSlug()}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', tenantSlug] });
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/subscriptions/${requireSlug()}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', tenantSlug] });
    }
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) => {
      return api.patch(`/subscriptions/${requireSlug()}/${id}/payment`, { paymentStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', tenantSlug] });
    }
  });

  return {
    subscriptions: subscriptionsQuery.data ?? [],
    isLoading: subscriptionsQuery.isLoading,
    isError: subscriptionsQuery.isError,
    hasValidSlug: !!tenantSlug,
    subscribe: createSubscription.mutateAsync,
    isSubscribing: createSubscription.isPending,
    cancelSubscription: cancelSubscription.mutateAsync,
    isCanceling: cancelSubscription.isPending,
    updatePaymentStatus: updatePaymentStatus.mutateAsync,
    isUpdatingPayment: updatePaymentStatus.isPending,
  };
}
