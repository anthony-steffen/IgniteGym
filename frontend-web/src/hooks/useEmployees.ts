import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { CreateEmployeePayload, EligibleUser, Employee } from '../modules/employee/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

interface UpdateEmployeePayload {
  id: string;
  payload: Pick<CreateEmployeePayload, 'roleTitle' | 'salary' | 'weeklyHours' | 'workSchedule'>;
}

interface UseEmployeesOptions {
  loadEmployees?: boolean;
  loadEligibleUsers?: boolean;
  includeInactive?: boolean;
}

export function useEmployees(slug?: string, options?: UseEmployeesOptions) {
  const queryClient = useQueryClient();
  const tenantSlug = normalizeTenantSlug(slug);
  const shouldLoadEmployees = options?.loadEmployees ?? true;
  const shouldLoadEligibleUsers = options?.loadEligibleUsers ?? true;
  const includeInactive = options?.includeInactive ?? false;

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  // 1. LISTAGEM
  const employeesQuery = useQuery<Employee[]>({
    queryKey: ['employees', tenantSlug, includeInactive],
    queryFn: async () => {
      const query = includeInactive ? '?includeInactive=true' : '';
      const { data } = await api.get<Employee[]>(`/employees/${tenantSlug}${query}`);
      return data;
    },
    enabled: !!tenantSlug && shouldLoadEmployees,
  });

  // 2. USUÁRIOS ELEGÍVEIS
  const eligibleUsersQuery = useQuery<EligibleUser[]>({
    queryKey: ['eligible-users', tenantSlug],
    queryFn: async () => {
      const { data } = await api.get<EligibleUser[]>(`/employees/${tenantSlug}/eligible`);
      return data;
    },
    enabled: !!tenantSlug && shouldLoadEligibleUsers,
  });

  // 3. CRIAÇÃO/ATUALIZAÇÃO
  const createEmployeeMutation = useMutation({
    mutationFn: async (payload: CreateEmployeePayload) => {
      const targetSlug = requireSlug();
      const { data } = await api.post<Employee>(`/employees/${targetSlug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantSlug] });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, payload }: UpdateEmployeePayload) => {
      const targetSlug = requireSlug();
      const { data } = await api.put<Employee>(`/employees/${targetSlug}/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantSlug] });
    },
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const targetSlug = requireSlug();
      await api.delete(`/employees/${targetSlug}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantSlug] });
    },
  });

  const reactivateEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const targetSlug = requireSlug();
      await api.patch(`/employees/${targetSlug}/${id}/reactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantSlug] });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    eligibleUsers: eligibleUsersQuery.data ?? [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    hasValidSlug: !!tenantSlug,
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
    reactivateEmployee: reactivateEmployeeMutation.mutateAsync,
  };
}
