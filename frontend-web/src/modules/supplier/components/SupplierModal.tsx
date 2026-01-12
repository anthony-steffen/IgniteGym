/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import type { Supplier, SupplierFormData } from '../types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedSupplier: Supplier | null;
}

export function SupplierModal({ isOpen, onClose, onSave, selectedSupplier }: SupplierModalProps) {
  // Inicialização direta do estado para evitar cascading renders
  const [formData, setFormData] = useState<SupplierFormData>({
    name: selectedSupplier?.name ?? '',
    description: selectedSupplier?.description ?? '',
    email: selectedSupplier?.email ?? '',
    phone: selectedSupplier?.phone ?? '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = selectedSupplier 
      ? { ...formData, id: selectedSupplier.id } 
      : formData;
    
    onSave(payload);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200 shadow-2xl max-w-lg">
        {/* Header seguindo o padrão visual do ProductModal */}
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedSupplier ? '📝 Editar Marca' : '🚀 Novo Fornecedor'}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sincronizado com Banco de Dados Central
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Marca */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nome da Marca</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold" 
              placeholder="Ex: Max Titanium"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required 
            />
          </div>

          {/* Grid para E-mail e Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">E-mail</span>
              </label>
              <input 
                type="email" 
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold text-sm" 
                placeholder="contato@marca.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Telefone</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold text-sm" 
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div className="form-control flex flex-col gap-2">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Descrição Detalhada</span>
            </label>
            <textarea 
              className="textarea textarea-bordered bg-gray-50 text-gray-800 border-2 h-24" 
              placeholder="Detalhes sobre o fornecedor ou marca..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          {/* Ações seguindo o layout centralizado do ProductModal */}
          <div className="flex justify-center mt-6 gap-2">
            <button 
              type="button" 
              className="btn bg-black text-white hover:bg-gray-800 font-black uppercase italic text-xs px-6" 
              onClick={onClose}
            >
              CANCELAR
            </button>
            <button 
              type="submit" 
              className="btn btn-primary px-8 font-black uppercase italic shadow-lg shadow-primary/20"
            >
              SALVAR
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}