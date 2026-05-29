import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Checkin, CreateCheckinData } from '../modules/checkin/types/index';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function useCheckins() {
  const queryClient = useQueryClient();
  const { slug } = useParams();
  const tenantSlug = normalizeTenantSlug(slug);

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  const checkinsQuery = useQuery<Checkin[]>({
    queryKey: ['checkins', tenantSlug],
    queryFn: async () => {
      const response = await api.get(`/checkins/${tenantSlug}`);
      const checkins = response.data as Checkin[];

      return checkins.map((checkin) => ({
        ...checkin,
        created_at: checkin.created_at || checkin.checked_in_at || checkin.createdAt,
      }));
    },
    enabled: !!tenantSlug,
  });

  const doCheckin = useMutation({
    mutationFn: async (data: CreateCheckinData) => {
      return api.post(`/checkins/${requireSlug()}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins', tenantSlug] });
    }
  });

  return {
    checkins: checkinsQuery.data ?? [],
    isLoading: checkinsQuery.isLoading,
    isError: checkinsQuery.isError,
    hasValidSlug: !!tenantSlug,
    registerCheckin: doCheckin.mutateAsync,
    isRegistering: doCheckin.isPending
  };
}
