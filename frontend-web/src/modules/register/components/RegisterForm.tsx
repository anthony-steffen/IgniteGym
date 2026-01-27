import { useForm } from 'react-hook-form';
import { useRegister } from '../../../hooks/useRegister';
import type { RegisterTenantData } from '../types';
import { Loader2, Building2, UserPlus } from 'lucide-react';

export function RegisterForm() {
  const { register, handleSubmit } = useForm<RegisterTenantData>();
  const { mutate, isPending } = useRegister();

  const onSubmit = (data: RegisterTenantData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Seção da Unidade */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <Building2 size={18} /> Dados da Academia
        </h3>
        <input 
          {...register('name', { required: true })}
          placeholder="NOME DA UNIDADE"
          className="input input-bordered w-full font-bold uppercase text-xs"
        />
        <input 
          {...register('slug', { required: true })}
          placeholder="SLUG-DA-UNIDADE (EX: MINHA-ACADEMIA)"
          className="input input-bordered w-full font-bold lowercase text-xs"
        />
      </div>

      <div className="divider"></div>

      {/* Seção do Administrador */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-2">
          <UserPlus size={18} /> Administrador Responsável
        </h3>
        <input 
          {...register('admin_name', { required: true })}
          placeholder="SEU NOME COMPLETO"
          className="input input-bordered w-full font-bold uppercase text-xs"
        />
        <input 
          {...register('admin_email', { required: true })}
          type="email"
          placeholder="E-MAIL DE ACESSO"
          className="input input-bordered w-full font-bold lowercase text-xs"
        />
        <input 
          {...register('admin_password_raw', { required: true })}
          type="password"
          placeholder="SENHA DE ACESSO"
          className="input input-bordered w-full font-bold text-xs"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="btn btn-primary w-full uppercase font-black italic shadow-lg shadow-primary/20"
      >
        {isPending ? <Loader2 className="animate-spin" /> : 'Finalizar Registro'}
      </button>
    </form>
  );
}