import { Users, UserCheck, UserPlus, AlertCircle } from 'lucide-react';
import type { StudentStatsData } from '../types';

interface StudentStatsProps {
  stats: StudentStatsData;
}

export function StudentStats({ stats }: StudentStatsProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Removemos border-r-4 para evitar o tracejado lateral em excesso */}
      <div className="stat bg-base-100 shadow rounded-box border-none">
        <div className="stat-figure text-blue-600"><Users size={24} /></div>
        <div className="stat-title text-xs uppercase font-bold text-gray-500">Total Alunos</div>
        <div className="stat-value text-2xl tracking-tighter">{stats.total}</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-box border-none">
        <div className="stat-figure text-success"><UserCheck size={24} /></div>
        <div className="stat-title text-xs uppercase font-bold text-gray-500">Ativos</div>
        <div className="stat-value text-2xl tracking-tighter">{stats.active}</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-box border-none">
        <div className="stat-figure text-purple-600"><UserPlus size={24} /></div>
        <div className="stat-title text-xs uppercase font-bold text-gray-500">Novos (Mês)</div>
        <div className="stat-value text-2xl tracking-tighter">{stats.newThisMonth}</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-box border-none">
        <div className="stat-figure text-error"><AlertCircle size={24} /></div>
        <div className="stat-title text-xs uppercase font-bold text-gray-500">Pendências</div>
        <div className="stat-value text-2xl tracking-tighter">{stats.pending}</div>
      </div>
    </section>
  );
}