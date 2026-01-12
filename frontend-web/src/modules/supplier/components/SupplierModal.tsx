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
  // Inicialização do Hook Form com os tipos definidos
  const { register, handleSubmit, reset } = useForm<SupplierFormData>();

  // Efeito para resetar os campos sempre que o modal abrir ou o fornecedor selecionado mudar
  useEffect(() => {
    if (isOpen) {
      if (selectedSupplier) {
        reset({
          name: selectedSupplier.name,
          description: selectedSupplier.description ?? '',
          email: selectedSupplier.email ?? '',
          phone: selectedSupplier.phone ?? '',
        });
      } else {
        // Limpa os campos para um novo cadastro
        reset({ name: '', description: '', email: '', phone: '' });
      }
    }
  }, [selectedSupplier, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = (data: SupplierFormData) => {
    const payload = selectedSupplier 
      ? { ...data, id: selectedSupplier.id } 
      : data;
    
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome da Marca */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nome da Marca</span>
            </label>
            <input 
              {...register('name', { required: true })}
              type="text" 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary" 
              placeholder="Ex: Max Titanium"
            />
          </div>

          {/* Grid para E-mail e Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">E-mail</span>
              </label>
              <input 
                {...register('email')}
                type="email" 
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold text-sm focus:border-primary" 
                placeholder="contato@marca.com"
              />
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Telefone</span>
              </label>
              <input 
                {...register('phone')}
                type="text" 
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold text-sm focus:border-primary" 
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div className="form-control flex flex-col gap-2">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Descrição Detalhada</span>
            </label>
            <textarea 
              {...register('description')}
              className="textarea textarea-bordered bg-gray-50 text-gray-800 border-2 h-24 focus:border-primary" 
              placeholder="Detalhes sobre o fornecedor ou marca..."
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