import { useEffect, useState } from 'react';
import type { Plan, PlanFormData } from '../types/index';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Plan | Omit<Plan, 'id'>) => void;
  selectedPlan: Plan | null;
}

export function PlanModal({ isOpen, onClose, onSave, selectedPlan }: PlanModalProps) {
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    duration_days: 0,
    price: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: selectedPlan?.name ?? '',
      duration_days: selectedPlan?.duration_days ?? 0,
      price: selectedPlan?.price ?? 0,
    });
  }, [isOpen, selectedPlan]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = selectedPlan
      ? { ...formData, id: selectedPlan.id, is_active: selectedPlan.is_active ?? true }
      : { ...formData, is_active: true };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedPlan ? 'Editar Plano' : 'Novo Plano'}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sincronizado com tabela de precos
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nome do Plano</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary"
              placeholder="Ex: Mensal VIP"
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Duracao (Dias)</span>
              </label>
              <input
                type="number"
                min={1}
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold"
                value={formData.duration_days}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, duration_days: Number(event.target.value) }))
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Valor (R$)</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-mono font-bold"
                value={formData.price}
                onChange={(event) => setFormData((prev) => ({ ...prev, price: Number(event.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-black text-white hover:bg-gray-800 border-none font-black uppercase italic text-xs px-8"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary px-10 font-black uppercase italic shadow-lg shadow-primary/20"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
