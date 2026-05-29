import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Student, StudentFormData, StudentHistoryData } from '../modules/student/types';

/**
 * Hook para gestão de alunos consumindo a API baseada em Slug
 * @param slug O identificador amigável da unidade vindo da URL
 */
export function useStudents(slug?: string) {
  const queryClient = useQueryClient();

  // 1. LISTAGEM (GET /students/:slug)
  const studentsQuery = useQuery({
    queryKey: ['students', slug],
    queryFn: async () => {
      const { data } = await api.get<Student[]>(`/students/${slug}`);
      return data;
    },
    enabled: !!slug, // Só executa se o slug estiver presente
  });

  // 2. CRIAÇÃO (POST /students/:slug)
  const createStudentMutation = useMutation({
    mutationFn: async (payload: StudentFormData) => {
      const { data } = await api.post(`/students/${slug}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', slug] });
    },
  });

  // 3. ATUALIZAÇÃO (PUT /students/:slug/:id)
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudentFormData }) => {
      const { data: response } = await api.put(`/students/${slug}/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', slug] });
    },
  });

  // 4. DESATIVAÇÃO (PATCH /students/:slug/:id/deactivate)
  // Nota: O Controller usa StudentService.deactivate, geralmente mapeado para PATCH ou DELETE
  const deactivateStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/students/${slug}/${id}/deactivate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', slug] });
    },
  });

  const getStudentHistory = async (id: string) => {
    const { data } = await api.get<StudentHistoryData>(`/students/${slug}/${id}/history`);
    return data;
  };

  return {
    students: studentsQuery.data ?? [],
    isLoading: studentsQuery.isLoading,
    isError: studentsQuery.isError,
    createStudent: createStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
    deactivateStudent: deactivateStudentMutation.mutateAsync,
    getStudentHistory,
  };
}
