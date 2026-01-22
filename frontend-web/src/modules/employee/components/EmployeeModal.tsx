/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useEmployees } from '../../../hooks/useEmployees';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId?: string;
  selectedEmployee: any | null; // Para futura edição
}

export function EmployeeModal({ isOpen, onClose, tenantId, selectedEmployee }: EmployeeModalProps) {
  const { eligibleUsers, createEmployee } = useEmployees(tenantId);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (selectedEmployee) {
        reset({
          userId: selectedEmployee.user_id,
          roleTitle: selectedEmployee.role_title,
        });
      } else {
        reset({ userId: '', roleTitle: 'STAFF' });
      }
    }
  }, [selectedEmployee, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: any) => {
    try {
      await createEmployee(data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {selectedEmployee ? '📝 Editar Staff' : '🚀 Contratar Staff'}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sincronizado com o controle de acesso da unidade
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Seleção de Usuário Elegível */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Selecionar Pessoa</span>
            </label>
            <select 
              {...register('userId', { required: true })}
              disabled={!!selectedEmployee}
              className="select select-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary"
            >
              <option value="">Escolha um usuário...</option>
              {eligibleUsers.map((user: any) => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>

          {/* Seleção de Cargo */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nível de Acesso</span>
            </label>
            <select 
              {...register('roleTitle', { required: true })}
              className="select select-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold focus:border-primary"
            >
              <option value="STAFF">STAFF (Instrutor / Recepção)</option>
              <option value="MANAGER">MANAGER (Gerente)</option>
            </select>
          </div>

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