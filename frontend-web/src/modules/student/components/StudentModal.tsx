import React, { useState } from 'react';
import type { Student, StudentFormData } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => Promise<void>;
  selectedStudent: Student | null;
}

export function StudentModal({ isOpen, onClose, onSave, selectedStudent }: StudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    name: selectedStudent?.user.name ?? '',
    email: selectedStudent?.user.email ?? '',
    phone: selectedStudent?.user.phone ?? '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box border border-base-300">
        <h3 className="font-black italic uppercase text-lg mb-4 text-primary">
          {selectedStudent ? 'Editar Aluno' : 'Novo Aluno'}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="input input-bordered w-full" 
            placeholder="Nome"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required 
          />
          <input 
            type="email"
            className="input input-bordered w-full" 
            placeholder="E-mail"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required 
          />
          <div className="flex gap-2">
            <input 
              className="input input-bordered w-1/2" 
              placeholder="Telefone"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}