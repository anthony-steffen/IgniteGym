import { ScrollText, Tag } from 'lucide-react';
import type { Plan } from '../types';

interface PlanStatsProps {
  plans: Plan[];
}

export function PlanStats({ plans }: PlanStatsProps) {
  const popularPlan =
    plans.length > 0
      ? plans.reduce((prev, curr) => (prev.price < curr.price ? prev : curr))
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="stat bg-base-100 shadow rounded-box border-b-4 border-primary border-r-4">
        <div className="stat-figure text-primary"><ScrollText size={24} /></div>
        <div className="stat-title text-xs font-bold uppercase text-base-content/60">Planos Ativos</div>
        <div className="stat-value text-2xl">{plans.length}</div>
        <div className="stat-desc font-medium text-base-content/60 italic">Disponiveis no catalogo</div>
      </div>

      <div className="stat bg-base-100 shadow rounded-box border-b-4 border-secondary border-r-4">
        <div className="stat-figure text-base-content"><Tag size={24} /></div>
        <div className="stat-title text-xs font-bold uppercase text-base-content/60">Plano Mais Acessivel</div>
        <div className="stat-value text-2xl text-base-content">
          {popularPlan ? popularPlan.name : '---'}
        </div>
        <div className="stat-desc font-medium text-success italic">
          {popularPlan ? `A partir de R$ ${(+popularPlan.price).toFixed(2)}` : 'Nenhum plano cadastrado'}
        </div>
      </div>
    </div>
  );
}
