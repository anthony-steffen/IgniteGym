import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ClipboardCheck, Settings, Menu, 
  UserCog, Package, ScrollText, DollarSign, UserPlus, 
  Building2, LogOut
} from 'lucide-react';
import { api } from '../services/api';

export function MainLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams(); // 👈 1. Captura o slug da URL (ex: 'academia-principal')

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('@IgniteGym:token');
    localStorage.removeItem('@IgniteGym:user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  /**
   * 2. Função auxiliar para gerar URLs dinâmicas com o slug
   * Se o slug for 'academia-principal' e o path for 'home', retorna '/academia-principal/home'
   */
  const getPath = (path: string) => `/${slug}/${path}`;

  /**
   * 3. Função auxiliar para marcar item ativo
   * Agora verifica se o pathname termina com o path desejado ou contém o slug
   */
  const isActive = (path: string) => pathname === getPath(path) ? 'active bg-primary text-white' : '';

  return (
    <div className="drawer md:drawer-open bg-base-200 min-h-screen">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* HEADER */}
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-20 w-full px-4">
          <div className="flex-none md:hidden">
            <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
              <Menu className="w-6 h-6 text-primary" />
            </label>
          </div>
          <div className="flex-1 px-2 font-bold italic uppercase tracking-tighter">
            IGNITE<span className="text-primary">GYM</span> - {slug?.replace(/-/g, ' ')} {/* 👈 Nome dinâmico */}
          </div>

          <div className="flex-none gap-2">
            <button 
              onClick={handleLogout}
              className="btn btn-ghost btn-sm text-error gap-2 font-bold uppercase"
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

      {/* SIDEBAR */}
      <aside className="drawer-side z-30">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-20 lg:w-64 min-h-screen bg-base-100 text-base-content border-r-2 border-base-300 flex flex-col gap-1">
          
          <li className="mb-6 hidden lg:block text-center">
             <h1 className="text-2xl font-black italic text-primary tracking-tighter uppercase">IGNITEGYM</h1>
          </li>

          {/* 4. Links atualizados usando a função getPath */}
          <li>
            <Link to={getPath('home')} className={`gap-4 p-3 ${isActive('home')}`}>
              <LayoutDashboard size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Geral</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('checkin')} className={`gap-4 p-3 ${isActive('checkin')}`}>
              <ClipboardCheck size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Check-Ins</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('employee')} className={`gap-4 p-3 ${isActive('employee')}`}>
              <UserCog size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Funcionários</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('products')} className={`gap-4 p-3 ${isActive('products')}`}>
              <Package size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Produtos/Estoque</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('suppliers')} className={`gap-4 p-3 ${isActive('suppliers')}`}>
              <Building2 size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Fornecedores</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('plans')} className={`gap-4 p-3 ${isActive('plans')}`}>
              <ScrollText size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Planos</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('sales')} className={`gap-4 p-3 ${isActive('sales')}`}>
              <DollarSign size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Vendas</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('students')} className={`gap-4 p-3 ${isActive('students')}`}>
              <Users size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Alunos</span>
            </Link>
          </li>

          <li>
            <Link to={getPath('subscriptions')} className={`gap-4 p-3 ${isActive('subscriptions')}`}>
              <UserPlus size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Inscrições</span>
            </Link>
          </li>

          <li className="mt-auto">
            <Link to={getPath('settings')} className={`gap-4 p-3 border-t border-base-300 pt-4 ${isActive('settings')}`}>
              <Settings size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Ajustes</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}