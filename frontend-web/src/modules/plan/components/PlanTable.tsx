import { Edit, Trash2 } from 'lucide-react';
import  type { Plan } from '../types';
interface PlanTableProps {
  plans: Plan[];
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}

export function PlanTable({ plans, onEdit, onDelete }: PlanTableProps) {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-[10px] uppercase tracking-widest text-gray-500">
              <th>Plano</th>
              <th>Duração</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-base-200">
                <td className="p-3">{plan.name}</td>
                <td className="p-3">{plan.duration_days} dias</td>
                <td className="p-3 text-success">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}
                </td>
                <td className="flex justify-center gap-2 p-3">
                  <button onClick={() => onEdit(plan)} className="btn btn-ghost btn-xs text-info p-0"><Edit size={16} /></button>
                  <button onClick={() => onDelete(plan.id)} className="btn btn-ghost btn-xs text-error p-0"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}