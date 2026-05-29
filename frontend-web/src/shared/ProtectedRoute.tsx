import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { normalizeTenantSlug } from '../utils/tenantSlug';

type StoredUser = {
  tenant_id?: string | null;
  slug?: string | null;
};

function readStoredUser(): StoredUser | null {
  const userJson = localStorage.getItem('@IgniteGym:user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as StoredUser;
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem('@IgniteGym:token');
  localStorage.removeItem('@IgniteGym:user');
}

export function ProtectedRoute() {
  const token = localStorage.getItem('@IgniteGym:token');
  const { slug } = useParams();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = readStoredUser();
  if (!user) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  const requestedSlug = normalizeTenantSlug(slug);

  // Usuario de unidade: sempre opera apenas no proprio slug
  if (user.tenant_id) {
    const ownSlug = normalizeTenantSlug(user.slug);

    if (!ownSlug) {
      clearSession();
      return <Navigate to="/login" replace />;
    }

    if (!requestedSlug || requestedSlug !== ownSlug) {
      return <Navigate to={`/${ownSlug}/home`} replace />;
    }
  }

  // Super-admin: sem slug entra no dashboard global.
  // Se vier slug invalido (ex: "undefined"), normaliza para /admin/dashboard.
  if (!user.tenant_id) {
    const isAdminArea = location.pathname.startsWith('/admin');
    if (!requestedSlug && !isAdminArea) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <Outlet />;
}
