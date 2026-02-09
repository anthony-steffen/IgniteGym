import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

export function useSubscriptions() {
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const subscriptionsQuery = useQuery({
    queryKey: ['subscriptions', slug],
    queryFn: async () => {
      // GET /subscriptions/:slug
      const response = await api.get(`/subscriptions/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const createSubscription = useMutation({
    mutationFn: async (data: { studentId: string; planId: string }) => {
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

  return {
    subscriptions: subscriptionsQuery.data ?? [],
    isLoading: subscriptionsQuery.isLoading,
    subscribe: createSubscription.mutateAsync,
    isSubscribing: createSubscription.isPending,
    cancelSubscription: cancelSubscription.mutateAsync
  };
} 