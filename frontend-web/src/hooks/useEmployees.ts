/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useEmployees(slug?: string) {
  const queryClient = useQueryClient();

  // 1. LISTAGEM
  const employeesQuery = useQuery({
    queryKey: ['employees', slug],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${slug}`);
      return data;
    },
    enabled: !!slug,
  });

  // 2. USUÁRIOS ELEGÍVEIS
  const eligibleUsersQuery = useQuery({
    queryKey: ['eligible-users', slug],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${slug}/eligible`);
      return data;
    },
    enabled: !!slug,
  });

  // 3. CRIAÇÃO/ATUALIZAÇÃO
  const createEmployeeMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(`/employees/${slug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', slug] });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.put(`/employees/${slug}/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', slug] });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${slug}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', slug] });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    eligibleUsers: eligibleUsersQuery.data ?? [],
    isLoading: employeesQuery.isLoading,
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
  };
}