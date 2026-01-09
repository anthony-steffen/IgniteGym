import { useState } from 'react';
import { Plus, ScrollText } from 'lucide-react';
import { usePlans } from '../../../hooks/usePlans';
import { PlanStats } from '../components/PlanStats';
import { PlanTable } from '../components/PlanTable';
import { PlanModal } from '../components/PlanModal';
import type { Plan } from '../types/index';

export function PlanPage() {
  const { plans, isLoading, deletePlan, createPlan, updatePlan } = usePlans();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSave = (data: Plan | Omit<Plan, 'id'>) => {
    if ('id' in data && data.id) {
      updatePlan(data as Plan);
    } else {
      createPlan(data as Omit<Plan, 'id'>);
    }
    setIsModalOpen(false);
  };

  if (isLoading) return <span className="loading loading-dots loading-lg text-primary"></span>;

  return (
    <div className="w-full space-y-6">
      {/* Header da Página */}
      <div className="flex justify-between">
        <div className="flex items-start gap-3">
          <ScrollText className="text-primary" size={35} />
          <h1 className="text-2xl font-black italic uppercase text-base-content">
            Planos
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Gerenciamento de planos
            </p>
          </h1>
        </div>
        <button
          onClick={() => handleOpenCreateModal()}
          className="btn btn-primary font-black italic uppercase text-[11px] p-2">
          <Plus size={10} strokeWidth={5} />
          Novo Plano
        </button>
      </div>

      <PlanStats plans={plans} />
      
      <PlanTable 
        plans={plans} 
        onEdit={handleOpenEditModal} 
        onDelete={(id) => confirm("Excluir?") && deletePlan(id)} 
      />

      <PlanModal 
        isOpen={isModalOpen} 
        selectedPlan={selectedPlan}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}