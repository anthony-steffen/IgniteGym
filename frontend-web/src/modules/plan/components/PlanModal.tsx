/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { Plan, PlanFormData } from '../types/index';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedPlan: Plan | null;
}

export function PlanModal({ isOpen, onClose, onSave, selectedPlan }: PlanModalProps) {
  // Inicialização direta do estado seguindo as boas práticas para evitar cascading renders
  const [formData, setFormData] = useState<PlanFormData>({
    name: selectedPlan?.name ?? '',
    duration_days: selectedPlan?.duration_days ?? 0,
    price: selectedPlan?.price ?? 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = selectedPlan 
      ? { ...formData, id: selectedPlan.id } 
      : formData;
    
    onSave(payload);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200 shadow-2xl max-w-lg">
        
        {/* Header seguindo a identidade visual do PDV */}
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedPlan ? '📝 Editar Plano' : '🚀 Novo Plano'}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sincronizado com Tabela de Preços Central
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nome do Plano */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Identificação do Plano</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary" 
              placeholder="Ex: Mensal VIP"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duração */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Duração (Dias)</span>
              </label>
              <input 
                type="number" 
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold" 
                placeholder="30"
                value={formData.duration_days}
                onChange={e => setFormData(prev => ({ ...prev, duration_days: Number(e.target.value) }))}
                required 
              />
            </div>

            {/* Preço */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Valor (R$)</span>
              </label>
              <input 
                type="number" 
                step="0.01"
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-mono font-bold" 
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                required 
              />
            </div>
          </div>

          {/* Ações Centralizadas e Padronizadas */}
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
      
      {/* Camada de fundo para fechamento manual */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}