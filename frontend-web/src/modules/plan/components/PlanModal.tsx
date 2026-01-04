import React, { useState } from 'react';
import type { Plan } from '../types/index';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Plan | Omit<Plan, 'id'>) => void;
  selectedPlan: Plan | null;
}

export function PlanModal({ isOpen, onClose, onSave, selectedPlan }: PlanModalProps) {
  // O estado é inicializado diretamente. 
  // O reset ocorrerá via 'key' no componente pai.
  const [formData, setFormData] = useState({
    name: selectedPlan?.name ?? '',
    duration_days: selectedPlan?.duration_days ?? 30,
    price: selectedPlan?.price ?? 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Se tiver selectedPlan, enviamos com ID (edição), senão enviamos sem (criação)
    const payload = selectedPlan 
      ? { ...formData, id: selectedPlan.id } 
      : formData;
    
    onSave(payload);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box border border-base-300">
        <h3 className="font-black italic uppercase text-lg mb-4">
          {selectedPlan ? 'Editar' : 'Novo'} <span className="text-primary">Plano</span>
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label font-bold text-xs uppercase text-gray-500">Nome do Plano</label>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-gray-500">Duração (Dias)</label>
              <input 
                type="number" 
                className="input input-bordered w-full" 
                value={formData.duration_days}
                onChange={e => setFormData(prev => ({ ...prev, duration_days: Number(e.target.value) }))}
                required 
              />
            </div>
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-gray-500">Preço (R$)</label>
              <input 
                type="number" 
                step="0.01"
                className="input input-bordered w-full" 
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                required 
              />
            </div>
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Confirmar</button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}