import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Student, StudentFormData } from '../modules/student/types';

export function useStudents() {
  const queryClient = useQueryClient();

  // LISTAGEM (Onde deu o erro 401)
  const studentsQuery = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      // Certifique-se de que a rota no backend é /students ou /student (conforme seu controller)
      const response = await api.get('/students'); 
      return response.data;
    },
    // Opcional: evita que o react-query tente buscar se o usuário não estiver logado
    enabled: !!localStorage.getItem('@IgniteGym:token'), 
  });

  // CRIAÇÃO
  const createStudentMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      // O tenantId deve ser pego do contexto de autenticação ou decode do token
      const tenantId = "seu-id-do-banco"; 
      const response = await api.post('/students', { ...data, tenantId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  // DESATIVAÇÃO
  const deactivateStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/students/${id}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  // ATUALIZAÇÃO
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudentFormData }) => {
      // O backend agora espera o user_id no parâmetro 'id'
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  return {
    students: studentsQuery.data ?? [],
    isLoading: studentsQuery.isLoading,
    isError: studentsQuery.isError, // Útil para mostrar feedback de erro 401 na UI
    createStudent: createStudentMutation.mutateAsync,
    deactivateStudent: deactivateStudentMutation.mutateAsync,
    updateStudent: updateStudentMutation.mutateAsync,
  };
}