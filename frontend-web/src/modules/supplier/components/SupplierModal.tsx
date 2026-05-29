/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Supplier, SupplierFormData } from '../types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedSupplier: Supplier | null;
}

export function SupplierModal({ isOpen, onClose, onSave, selectedSupplier }: SupplierModalProps) {
  const { register, handleSubmit, reset } = useForm<SupplierFormData>();

  useEffect(() => {
    if (!isOpen) return;

    if (selectedSupplier) {
      reset({
        name: selectedSupplier.name,
        description: selectedSupplier.description ?? '',
        email: selectedSupplier.email ?? '',
        phone: selectedSupplier.phone ?? '',
      });
      return;
    }

    reset({ name: '', description: '', email: '', phone: '' });
  }, [selectedSupplier, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = (data: SupplierFormData) => {
    const payload = selectedSupplier ? { ...data, id: selectedSupplier.id } : data;
    onSave(payload);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h3>
          <p className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest">
            Sincronizado com base de fornecedores
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Nome da marca</span>
            </label>
            <input
              {...register('name', { required: true })}
              type="text"
              className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold focus:border-primary"
              placeholder="Ex: Max Titanium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-base-content/70">E-mail</span>
              </label>
              <input
                {...register('email')}
                type="email"
                className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold text-sm focus:border-primary"
                placeholder="contato@marca.com"
              />
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-base-content/70">Telefone</span>
              </label>
              <input
                {...register('phone')}
                type="text"
                className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold text-sm focus:border-primary"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="form-control flex flex-col gap-2">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Descricao detalhada</span>
            </label>
            <textarea
              {...register('description')}
              className="textarea textarea-bordered bg-base-100 text-base-content border-base-300 h-24 focus:border-primary"
              placeholder="Detalhes sobre o fornecedor ou marca..."
            />
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <button type="button" className="btn btn-ghost border border-base-300 font-black uppercase italic text-xs px-6" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary px-8 font-black uppercase italic shadow-lg shadow-primary/20">
              Salvar
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
