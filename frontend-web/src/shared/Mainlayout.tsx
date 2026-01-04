import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ClipboardCheck, Settings, Menu, 
  UserCog, Package, ScrollText, DollarSign, UserPlus 
} from 'lucide-react';

export function MainLayout() {
  const { pathname } = useLocation();

  // Função auxiliar para marcar item ativo
  const isActive = (path: string) => pathname === path ? 'active bg-primary text-white' : '';

  return (
    <div className="drawer lg:drawer-open bg-base-200 min-h-screen">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* HEADER */}
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-20 w-full px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
              <Menu className="w-6 h-6 text-primary" />
            </label>
          </div>
          <div className="flex-1 px-2 font-bold italic uppercase tracking-tighter">
            IGNITE<span className="text-primary">GYM</span> - Unidade Centro
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* SIDEBAR */}
      <aside className="drawer-side z-30">
        <label htmlFor="main-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-20 lg:w-64 min-h-screen bg-base-100 text-base-content border-r border-base-300 flex flex-col gap-1">
          
          <li className="mb-6 hidden lg:block text-center">
             <h1 className="text-2xl font-black italic text-primary tracking-tighter uppercase">IGNITEGYM</h1>
          </li>

          {/* Links Mapeados pelos seus Módulos */}
          <li>
            <Link to="/dashboard" className={`gap-4 p-3 ${isActive('/dashboard')}`}>
              <LayoutDashboard size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Geral</span>
            </Link>
          </li>

          <li>
            <Link to="/checkin" className={`gap-4 p-3 ${isActive('/checkin')}`}>
              <ClipboardCheck size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Check-Ins</span>
            </Link>
          </li>

          <li>
            <Link to="/funcionarios" className={`gap-4 p-3 ${isActive('/funcionarios')}`}>
              <UserCog size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Funcionários</span>
            </Link>
          </li>

          <li>
            <Link to="/produtos" className={`gap-4 p-3 ${isActive('/produtos')}`}>
              <Package size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Produtos/Estoque</span>
            </Link>
          </li>

          <li>
            <Link to="/planos" className={`gap-4 p-3 ${isActive('/planos')}`}>
              <ScrollText size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Planos</span>
            </Link>
          </li>

          <li>
            <Link to="/vendas" className={`gap-4 p-3 ${isActive('/vendas')}`}>
              <DollarSign size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Vendas</span>
            </Link>
          </li>

          <li>
            <Link to="/alunos" className={`gap-4 p-3 ${isActive('/alunos')}`}>
              <Users size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Alunos</span>
            </Link>
          </li>

          <li>
            <Link to="/inscricoes" className={`gap-4 p-3 ${isActive('/inscricoes')}`}>
              <UserPlus size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Inscrições</span>
            </Link>
          </li>

          <li className="mt-auto">
            <Link to="/configuracoes" className={`gap-4 p-3 border-t border-base-300 pt-4 ${isActive('/configuracoes')}`}>
              <Settings size={22} /> <span className="hidden lg:inline text-xs font-bold uppercase">Ajustes</span>
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}