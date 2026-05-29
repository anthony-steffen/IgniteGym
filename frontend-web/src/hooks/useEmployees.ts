import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CreateEmployeePayload, EligibleUser, Employee } from '../modules/employee/types';

interface UpdateEmployeePayload {
  id: string;
  payload: Pick<CreateEmployeePayload, 'roleTitle' | 'salary' | 'weeklyHours' | 'workSchedule'>;
}

export function useEmployees(slug?: string) {
  const queryClient = useQueryClient();

  // 1. LISTAGEM
  const employeesQuery = useQuery<Employee[]>({
    queryKey: ['employees', slug],
    queryFn: async () => {
      const { data } = await api.get<Employee[]>(`/employees/${slug}`);
      return data;
    },
    enabled: !!slug,
  });

  // 2. USUÁRIOS ELEGÍVEIS
  const eligibleUsersQuery = useQuery<EligibleUser[]>({
    queryKey: ['eligible-users', slug],
    queryFn: async () => {
      const { data } = await api.get<EligibleUser[]>(`/employees/${slug}/eligible`);
      return data;
    },
    enabled: !!slug,
  });

  // 3. CRIAÇÃO/ATUALIZAÇÃO
  const createEmployeeMutation = useMutation({
    mutationFn: async (payload: CreateEmployeePayload) => {
      const { data } = await api.post<Employee>(`/employees/${slug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', slug] });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, payload }: UpdateEmployeePayload) => {
      const { data } = await api.put<Employee>(`/employees/${slug}/${id}`, payload);
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
