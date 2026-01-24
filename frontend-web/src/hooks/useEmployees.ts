/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useEmployees(tenantId?: string) {
  const queryClient = useQueryClient();

  // MONITOR DE ENTRADA: Verifica se o hook recebeu o ID necessário
  console.log(`[useEmployees] Renderizado. tenantId atual: "${tenantId}"`);

  // 1. LISTAGEM (O seu GET que parece não estar disparando)
  const employeesQuery = useQuery({
    queryKey: ['employees', tenantId],
    queryFn: async () => {
      const url = `/employees/${tenantId}`;
      console.log(`[📡 FETCH] Iniciando GET em: ${url}`);
      try {
        const { data } = await api.get(url);
        console.log(`[✅ FETCH SUCCESS] Dados recuperados:`, data);
        return data;
      } catch (err: any) {
        console.error(`[❌ FETCH ERROR] Erro na rota ${url}:`, err.response?.data || err.message);
        throw err;
      }
    },
    enabled: !!tenantId, // Se tenantId for "", a requisição NÃO acontece.
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  // 2. USUÁRIOS ELEGÍVEIS (Para o Modal)
  const eligibleUsersQuery = useQuery({
    queryKey: ['eligible-users', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/employees/${tenantId}/eligible`);
      return data;
    },
    enabled: !!tenantId,
  });

  // 3. CRIAÇÃO
  const createEmployeeMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post(`/employees/${tenantId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['eligible-users', tenantId] });
    },
  });

  // 4. ATUALIZAÇÃO
  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.put(`/employees/${tenantId}/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] });
    },
  });

  // 5. DELEÇÃO
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/employees/${tenantId}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['eligible-users', tenantId] });
    },
  });

  // MONITOR DE BLOQUEIO
  if (!tenantId) {
    console.warn("[useEmployees] ⚠️ Requisição suspensa: tenantId está ausente.");
  }

  return {
    employees: employeesQuery.data ?? [],
    eligibleUsers: eligibleUsersQuery.data ?? [],
    isLoading: employeesQuery.isLoading || eligibleUsersQuery.isLoading,
    isError: employeesQuery.isError,
    // Mantendo todos os seus métodos originais
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
  };
}