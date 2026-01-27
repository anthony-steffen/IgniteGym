/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import type { RegisterTenantData, RegisterResponse } from '../modules/register/types/index';
import { useNavigate } from 'react-router-dom';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterTenantData) => {
      // Endpoint conforme definido no seu tenants.routes.ts
      const response = await api.post<RegisterResponse>('/tenants/register', data);
      return response.data;
    },
    onSuccess: () => {
      // Após sucesso, redireciona para login ou mostra feedback
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao realizar registro.';
      alert(message);
    }
  });
}