import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001', // Ajuste para sua porta do backend
});

// Interceptor para injetar o token em todas as chamadas futuras
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@IgniteGym:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});