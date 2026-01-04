import { useState } from 'react';
import { Plus } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">Planos</h1>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={20} /> Novo Plano
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