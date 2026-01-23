import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface CreateEmployeePayload {
  roleTitle: string;
  salary: number;
  weeklyHours: number;
  workSchedule: object;
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
}

export function useEmployees(tenantId?: string) {
  const queryClient = useQueryClient();

  // 1. Busca funcionários atuais (Tabela)
  const employeesQuery = useQuery({
    queryKey: ['employees', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });

  // 2. Busca usuários elegíveis (Select do Modal)
  const eligibleUsersQuery = useQuery({
    queryKey: ['eligible-users', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${tenantId}/eligible`);
      return data;
    },
    enabled: !!tenantId,
  });

  // 3. Mutação para criar/contratar (Atualizada para o novo contrato)
  const createEmployeeMutation = useMutation({
    mutationFn: async (payload: CreateEmployeePayload) => {
      const { data } = await api.post(`/employees/${tenantId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['eligible-users', tenantId] });
    },
  });

  // 4. Mutação para atualizar (Edição)
  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateEmployeePayload> }) => {
      const { data } = await api.put(`/employees/${tenantId}/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] });
    },
  });

  // 5. Mutação para deletar
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/employees/${tenantId}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['eligible-users', tenantId] });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    eligibleUsers: eligibleUsersQuery.data ?? [],
    isLoading: employeesQuery.isLoading || eligibleUsersQuery.isLoading,
    isCreating: createEmployeeMutation.isPending,
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
  };
}