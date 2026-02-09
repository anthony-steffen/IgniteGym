import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Checkin, CreateCheckinData } from '../modules/checkin/types/index';

export function useCheckins() {
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const checkinsQuery = useQuery<Checkin[]>({
    queryKey: ['checkins', slug],
    queryFn: async () => {
      const response = await api.get(`/checkins/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const doCheckin = useMutation({
    mutationFn: async (data: CreateCheckinData) => {
      return api.post(`/checkins/${slug}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins', slug] });
    }
  });

  return {
    checkins: checkinsQuery.data ?? [],
    isLoading: checkinsQuery.isLoading,
    registerCheckin: doCheckin.mutateAsync,
    isRegistering: doCheckin.isPending
  };
}