import { Edit, RotateCcw, Trash2 } from 'lucide-react';
import type { Plan } from '../types';
import { IconActionButton } from '../../../shared/components/IconActionButton';

interface PlanTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDeactivate: (id: string) => void;
  onReactivate: (plan: Plan) => void;
}

export function PlanTable({ plans, onEdit, onDeactivate, onReactivate }: PlanTableProps) {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-[10px] uppercase tracking-widest text-base-content/60">
              <th>Plano</th>
              <th>Duracao</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-base-200">
                <td className="p-3 font-bold">{plan.name}</td>
                <td className="p-3">{plan.duration_days} dias</td>
                <td className="p-3 text-success">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}
                </td>
                <td className="p-3">
                  <span className={`badge badge-sm font-bold ${plan.is_active === false ? 'badge-error' : 'badge-success'}`}>
                    {plan.is_active === false ? 'INATIVO' : 'ATIVO'}
                  </span>
                </td>
                <td className="flex justify-center gap-2 p-3">
                  <IconActionButton
                    label="Editar plano"
                    tone="info"
                    onClick={() => onEdit(plan)}
                    icon={<Edit size={16} />}
                  />
                  {plan.is_active === false ? (
                    <IconActionButton
                      label="Reativar plano"
                      tone="success"
                      onClick={() => onReactivate(plan)}
                      icon={<RotateCcw size={16} />}
                    />
                  ) : (
                    <IconActionButton
                      label="Desativar plano"
                      tone="error"
                      onClick={() => onDeactivate(plan.id)}
                      icon={<Trash2 size={16} />}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
