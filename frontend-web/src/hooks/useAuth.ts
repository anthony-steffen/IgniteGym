/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { api } from '../services/api';
import type { AuthResponse } from '../modules/auth/types';
import { normalizeTenantSlug } from '../utils/tenantSlug';

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const storageUser = localStorage.getItem('@IgniteGym:user');
  const user = storageUser ? JSON.parse(storageUser) : null;

  async function signIn(email: string, password: string): Promise<AuthResponse> {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      const { token, user } = response.data;
      const normalizedSlug = normalizeTenantSlug(user.slug);

      if (user.tenant_id && !normalizedSlug) {
        throw new Error('Usuario sem unidade valida vinculada.');
      }

      const normalizedUser = {
        ...user,
        slug: normalizedSlug,
      };

      // Configura axios e storage
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('@IgniteGym:token', token);
      localStorage.setItem('@IgniteGym:user', JSON.stringify(normalizedUser));

      return { ...response.data, user: normalizedUser };
    } catch (error: any) {
      const message = error.response?.data?.message || 'E-mail ou senha inválidos';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  return { signIn, loading, user };
}
