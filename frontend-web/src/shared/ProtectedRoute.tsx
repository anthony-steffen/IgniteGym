//src/shared/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const token = localStorage.getItem('@IgniteGym:token');

  // Se não existir token, manda direto para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}