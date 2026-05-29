import { Activity, AlertCircle, CircleDollarSign, UserPlus, Users } from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function HomePage() {
  const { dashboard, isLoading } = useDashboard();
  const { metrics, weeklyCheckins } = dashboard;
  const maxCheckins = Math.max(...weeklyCheckins.map((point) => point.total), 1);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-blue-900 border-r-4">
          <div className="stat-figure text-blue-900"><Users size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-base-content/60">Total Alunos</div>
          <div className="stat-value text-2xl tracking-tighter">{metrics.totalStudents}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-emerald-700 border-r-4">
          <div className="stat-figure text-emerald-700"><CircleDollarSign size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-base-content/60">Receita do Mes</div>
          <div className="stat-value text-2xl tracking-tighter">{formatCurrency(metrics.monthlyRevenue)}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-violet-700 border-r-4">
          <div className="stat-figure text-violet-700"><Activity size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-base-content/60">Check-ins Hoje</div>
          <div className="stat-value text-2xl tracking-tighter">{metrics.checkinsToday}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-amber-600 border-r-4">
          <div className="stat-figure text-amber-600"><UserPlus size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-base-content/60">Matriculas (Mes)</div>
          <div className="stat-value text-2xl tracking-tighter">{metrics.newSubscriptionsMonth}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-error border-r-4">
          <div className="stat-figure text-error"><AlertCircle size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-base-content/60">Pagamentos Pendentes</div>
          <div className="stat-value text-2xl tracking-tighter">{metrics.pendingPayments}</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-box border-b-4 border-cyan-700 border-r-4">
          <div className="stat-figure text-cyan-700"><Users size={24} /></div>
          <div className="stat-title text-xs uppercase font-bold text-base-content/60">Matriculas Ativas</div>
          <div className="stat-value text-2xl tracking-tighter">{metrics.activeSubscriptions}</div>
        </div>
      </section>

      <div className="bg-base-100 border border-base-300 rounded-box shadow-sm">
        <div className="p-5 border-b border-base-200">
          <h2 className="text-sm font-black italic uppercase tracking-tight">Frequencia Semanal</h2>
        </div>

        <div className="p-5">
          {weeklyCheckins.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs font-bold uppercase text-base-content/50">
              Sem registros na semana atual
            </div>
          ) : (
            <div className="flex items-end justify-between h-48 gap-2">
              {weeklyCheckins.map((point) => {
                const height = Math.max((point.total / maxCheckins) * 100, point.total > 0 ? 8 : 0);
                return (
                  <div key={point.date} className="flex w-full flex-col items-center gap-2">
                    <div className="h-full w-full bg-primary/15 rounded-md relative overflow-hidden">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-primary rounded-md"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-base-content/60 uppercase">{point.label}</span>
                    <span className="text-[10px] font-black text-primary">{point.total}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
