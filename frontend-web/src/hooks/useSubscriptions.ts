import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { CreateSubscriptionPayload, PaymentStatus, Subscription } from '../modules/subscription/types';

export function useSubscriptions() {
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const subscriptionsQuery = useQuery<Subscription[]>({
    queryKey: ['subscriptions', slug],
    queryFn: async () => {
      // GET /subscriptions/:slug
      const response = await api.get<Subscription[]>(`/subscriptions/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const createSubscription = useMutation({
    mutationFn: async (data: CreateSubscriptionPayload) => {
      // POST /subscriptions/:slug
      // O backend espera studentId e planId conforme seu CreateSubscriptionDTO
      return api.post(`/subscriptions/${slug}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', slug] });
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async (id: string) => {
      // DELETE /subscriptions/:slug/:id
      return api.delete(`/subscriptions/${slug}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', slug] });
    }
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) => {
      return api.patch(`/subscriptions/${slug}/${id}/payment`, { paymentStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', slug] });
    }
  });

  return {
    subscriptions: subscriptionsQuery.data ?? [],
    isLoading: subscriptionsQuery.isLoading,
    subscribe: createSubscription.mutateAsync,
    isSubscribing: createSubscription.isPending,
    cancelSubscription: cancelSubscription.mutateAsync,
    isCanceling: cancelSubscription.isPending,
    updatePaymentStatus: updatePaymentStatus.mutateAsync,
    isUpdatingPayment: updatePaymentStatus.isPending,
  };
}
