import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Settings,
  Menu,
  UserCog,
  Package,
  ScrollText,
  DollarSign,
  UserPlus,
  Building2,
  LogOut,
} from 'lucide-react';
import { api } from '../services/api';
import { normalizeTenantSlug } from '../utils/tenantSlug';

type StoredUser = {
  tenant_id?: string | null;
  slug?: string | null;
};

function readStoredUser(): StoredUser | null {
  const raw = localStorage.getItem('@IgniteGym:user');
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const storedUser = readStoredUser();

  const tenantSlug = normalizeTenantSlug(slug) || normalizeTenantSlug(storedUser?.slug);
  const isAdminArea = pathname.startsWith('/admin');

  const handleLogout = () => {
    localStorage.removeItem('@IgniteGym:token');
    localStorage.removeItem('@IgniteGym:user');
    delete api.defaults.headers.common.Authorization;
    navigate('/login');
  };

  const getTenantPath = (path: string) => {
    if (!tenantSlug) return '/admin/dashboard';
    return `/${tenantSlug}/${path}`;
  };

  const isActive = (path: string) => (pathname === getTenantPath(path) ? 'active bg-primary text-white' : '');

  const tenantLinks = [
    { path: 'home', label: 'Geral', icon: LayoutDashboard },
    { path: 'checkin', label: 'Check-Ins', icon: ClipboardCheck },
    { path: 'employee', label: 'Funcionarios', icon: UserCog },
    { path: 'products', label: 'Produtos/Estoque', icon: Package },
    { path: 'suppliers', label: 'Fornecedores', icon: Building2 },
    { path: 'plans', label: 'Planos', icon: ScrollText },
    { path: 'sales', label: 'Vendas', icon: DollarSign },
    { path: 'students', label: 'Alunos', icon: Users },
    { path: 'subscriptions', label: 'Inscricoes', icon: UserPlus },
  ];

  return (
    <div className="drawer md:drawer-open bg-base-200 min-h-screen">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-20 w-full px-4">
          <div className="flex-none md:hidden">
            <label htmlFor="main-drawer" className="btn btn-square btn-ghost" aria-label="Abrir menu lateral" title="Abrir menu lateral">
              <Menu className="w-6 h-6 text-primary" />
            </label>
          </div>

          <div className="flex-1 px-2 font-bold italic uppercase tracking-tighter">
            IGNITE<span className="text-primary">GYM</span> -{' '}
            {tenantSlug ? tenantSlug.replace(/-/g, ' ') : 'painel global'}
          </div>

          <div className="flex-none gap-2">
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm text-error gap-2 font-bold uppercase"
              aria-label="Sair da conta"
              title="Sair da conta"
            >
              <span className="hidden sm:inline">Sair</span>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <aside className="drawer-side z-30">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-20 lg:w-64 min-h-screen bg-base-100 text-base-content border-r-2 border-base-300 flex flex-col gap-1">
          <li className="mb-6 hidden lg:block text-center">
            <h1 className="text-2xl font-black italic text-primary tracking-tighter uppercase">IGNITEGYM</h1>
          </li>

          {tenantSlug ? (
            <>
              {tenantLinks.map((link) => (
                <li key={link.path}>
                  <Link to={getTenantPath(link.path)} className={`gap-4 p-3 ${isActive(link.path)}`}>
                    <link.icon size={22} />
                    <span className="hidden lg:inline text-xs font-bold uppercase">{link.label}</span>
                  </Link>
                </li>
              ))}

              <li className="mt-auto">
                <Link
                  to={getTenantPath('settings')}
                  className={`gap-4 p-3 border-t border-base-300 pt-4 ${isActive('settings')}`}
                >
                  <Settings size={22} />
                  <span className="hidden lg:inline text-xs font-bold uppercase">Ajustes</span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/admin/dashboard" className={`gap-4 p-3 ${isAdminArea ? 'active bg-primary text-white' : ''}`}>
                <LayoutDashboard size={22} />
                <span className="hidden lg:inline text-xs font-bold uppercase">Dashboard Global</span>
              </Link>
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
}
