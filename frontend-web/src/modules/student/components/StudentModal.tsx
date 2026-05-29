import { useEffect, useState } from 'react';
import type { Student, StudentFormData } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => Promise<void>;
  selectedStudent: Student | null;
}

export function StudentModal({ isOpen, onClose, onSave, selectedStudent }: StudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: selectedStudent?.user.name ?? '',
      email: selectedStudent?.user.email ?? '',
      phone: selectedStudent?.user.phone ?? '',
    });
  }, [isOpen, selectedStudent]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedStudent ? 'Editar Aluno' : 'Novo Aluno'}
          </h3>
          <p className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest">
            Cadastro sincronizado com a unidade
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Nome completo</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold focus:border-primary"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">E-mail</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold focus:border-primary"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Telefone / WhatsApp</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold focus:border-primary"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            />
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost border border-base-300 font-black uppercase italic text-xs px-8">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary px-10 font-black uppercase italic shadow-lg shadow-primary/20">
              Salvar aluno
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
