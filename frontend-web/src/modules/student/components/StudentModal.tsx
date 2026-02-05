import { useState } from 'react';
import type { Student, StudentFormData } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => Promise<void>;
  selectedStudent: Student | null;
}

export function StudentModal({ isOpen, onClose, onSave, selectedStudent }: StudentModalProps) {
  const initialFormData: StudentFormData = {
    name: selectedStudent?.user.name ?? '',
    email: selectedStudent?.user.email ?? '',
    phone: selectedStudent?.user.phone ?? '',
  };

  const [formData, setFormData] = useState<StudentFormData>(initialFormData);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedStudent ? '📝 Editar Aluno' : '🚀 Novo Aluno'}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sincronizado com Unidade Local
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nome Completo</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">E-mail</span>
            </label>
            <input 
              type="email" 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Telefone / WhatsApp</span>
            </label>
            <input 
              type="text"
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary" 
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
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
              Salvar Aluno
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}