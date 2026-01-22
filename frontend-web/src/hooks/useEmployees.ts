import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Employee, CreateEmployeeData } from '../modules/employee/types/index';

export function useEmployees(tenantId?: string) {
  const queryClient = useQueryClient();

  // Lista de funcionários atuais
  const employeesQuery = useQuery<Employee[]>({
    queryKey: ['employees', tenantId],
    queryFn: async () => {
      const response = await api.get(`/employees/${tenantId}`);
      return response.data;
    },
    enabled: !!tenantId,
  });

  // Lista de usuários que podem ser contratados
  const eligibleUsersQuery = useQuery({
    queryKey: ['eligible-users', tenantId],
    queryFn: async () => {
      const response = await api.get(`/employees/${tenantId}/eligible`);
      return response.data;
    },
    enabled: !!tenantId,
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (data: CreateEmployeeData) => api.post(`/employees/${tenantId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['eligible-users'] });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    eligibleUsers: eligibleUsersQuery.data ?? [],
    isLoading: employeesQuery.isLoading,
    createEmployee: createEmployeeMutation.mutateAsync,
  };
}