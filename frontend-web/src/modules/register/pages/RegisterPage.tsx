import { useForm } from 'react-hook-form';
import { useRegister } from '../../../hooks/useRegister';
import type { RegisterTenantData } from '../types';
import { Loader2, Dumbbell } from 'lucide-react';

export function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterTenantData>();
  const { mutate, isPending } = useRegister();

  const onSubmit = (data: RegisterTenantData) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="max-w-xl w-full bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden">
        
        {/* Header Visual */}
        <div className="bg-primary p-6 text-primary-content flex items-center justify-center gap-3">
          <Dumbbell size={32} />
          <h1 className="text-2xl font-black italic uppercase italic tracking-tighter">Novo Registro</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          {/* Seção Unidade (Tenant) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label text-[10px] font-black uppercase text-gray-500">Dados da Unidade</label>
            </div>
            
            <div className="form-control">
              <input 
                {...register('name', { required: true })}
                className="input input-bordered font-bold uppercase text-xs"
                placeholder="NOME DA ACADEMIA"
              />
            </div>

            <div className="form-control">
              <input 
                {...register('slug', { required: true })}
                className="input input-bordered font-bold lowercase text-xs"
                placeholder="slug-da-unidade"
              />
            </div>

            <div className="form-control md:col-span-2">
              <input 
                {...register('address')}
                className="input input-bordered font-bold uppercase text-xs"
                placeholder="ENDEREÇO COMPLETO"
              />
            </div>
          </div>

          <div className="divider opacity-50"></div>

          {/* Seção Administrador (User) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label text-[10px] font-black uppercase text-gray-500">Dados do Administrador</label>
            </div>

            <div className="form-control md:col-span-2">
              <input 
                {...register('admin_name', { required: true })}
                className="input input-bordered font-bold uppercase text-xs"
                placeholder="NOME COMPLETO DO GESTOR"
              />
            </div>

            <div className="form-control">
              <input 
                {...register('admin_email', { required: true })}
                type="email"
                className="input input-bordered font-bold lowercase text-xs"
                placeholder="E-MAIL@EXEMPLO.COM"
              />
            </div>

            <div className="form-control">
              <input 
                {...register('admin_password', { required: true })}
                type="password"
                className="input input-bordered font-bold text-xs"
                placeholder="SENHA DE ACESSO"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="btn btn-primary w-full uppercase font-black italic gap-2 shadow-lg shadow-primary/20"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Finalizar e Criar Unidade'}
          </button>
        </form>
      </div>
    </div>
  );
}