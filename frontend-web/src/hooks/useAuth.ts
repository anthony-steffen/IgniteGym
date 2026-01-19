/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { api } from '../services/api';
import type { AuthResponse } from '../modules/auth/types';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function signIn(email: string, password: string): Promise<AuthResponse> {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // Configura axios e storage
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('@IgniteGym:token', token);
      localStorage.setItem('@IgniteGym:user', JSON.stringify(user));

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'E-mail ou senha inválidos';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  return { signIn, loading };
}