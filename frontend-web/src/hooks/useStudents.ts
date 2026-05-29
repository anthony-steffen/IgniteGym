import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Student, StudentFormData, StudentHistoryData } from '../modules/student/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

interface UseStudentsOptions {
  includeInactive?: boolean;
}

/**
 * Hook para gestão de alunos consumindo a API baseada em Slug
 * @param slug O identificador amigável da unidade vindo da URL
 */
export function useStudents(slug?: string, options?: UseStudentsOptions) {
  const queryClient = useQueryClient();
  const tenantSlug = normalizeTenantSlug(slug);
  const includeInactive = options?.includeInactive ?? false;

  const requireSlug = () => {
    if (!tenantSlug) throw new Error('Unidade invalida para esta operacao.');
    return tenantSlug;
  };

  // 1. LISTAGEM (GET /students/:slug)
  const studentsQuery = useQuery({
    queryKey: ['students', tenantSlug, includeInactive],
    queryFn: async () => {
      const query = includeInactive ? '?includeInactive=true' : '';
      const { data } = await api.get<Student[]>(`/students/${tenantSlug}${query}`);
      return data;
    },
    enabled: !!tenantSlug,
  });

  // 2. CRIAÇÃO (POST /students/:slug)
  const createStudentMutation = useMutation({
    mutationFn: async (payload: StudentFormData) => {
      const targetSlug = requireSlug();
      const { data } = await api.post(`/students/${targetSlug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', tenantSlug] });
    },
  });

  // 3. ATUALIZAÇÃO (PUT /students/:slug/:id)
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudentFormData }) => {
      const targetSlug = requireSlug();
      const { data: response } = await api.put(`/students/${targetSlug}/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', tenantSlug] });
    },
  });

  // 4. DESATIVAÇÃO (PATCH /students/:slug/:id/deactivate)
  // Nota: O Controller usa StudentService.deactivate, geralmente mapeado para PATCH ou DELETE
  const deactivateStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const targetSlug = requireSlug();
      const { data } = await api.patch(`/students/${targetSlug}/${id}/deactivate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', tenantSlug] });
    },
  });

  const reactivateStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const targetSlug = requireSlug();
      const { data } = await api.patch(`/students/${targetSlug}/${id}/reactivate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', tenantSlug] });
    },
  });

  const getStudentHistory = async (id: string) => {
    const targetSlug = requireSlug();
    const { data } = await api.get<StudentHistoryData>(`/students/${targetSlug}/${id}/history`);
    return data;
  };

  return {
    students: studentsQuery.data ?? [],
    isLoading: studentsQuery.isLoading,
    isError: studentsQuery.isError,
    hasValidSlug: !!tenantSlug,
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
    deactivateStudent: deactivateStudentMutation.mutateAsync,
    reactivateStudent: reactivateStudentMutation.mutateAsync,
    getStudentHistory,
  };
}
