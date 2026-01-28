import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useTenant } from '../../../hooks/useTenant';
import type { UpdateUnitFormData } from '../types';
import { Save, Loader2 } from 'lucide-react';

export function EditUnitForm() {
  const { unit, updateUnit, isUpdating } = useTenant();
  const { register, handleSubmit, reset } = useForm<UpdateUnitFormData>();

  // Sincroniza os dados do banco com o formulário
  useEffect(() => {
    if (unit) {
      reset({
        name: unit.name,
        slug: unit.slug,
        address: unit.address || '',
        contact_email: unit.contact_email || '',
      });
    }
  }, [unit, reset]);

  const onSubmit = (data: UpdateUnitFormData) => {
    updateUnit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome da Unidade */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-[10px] font-black uppercase text-base-content/60">Nome da Academia</span>
          </label>
          <input
            {...register('name', { required: true })}
            type="text"
            className="input input-bordered font-bold uppercase text-xs focus:input-primary"
            placeholder="NOME DA UNIDADE"
          />
        </div>

        {/* Slug/URL */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-[10px] font-black uppercase text-base-content/60">Identificador URL (Slug)</span>
          </label>
          <input
            {...register('slug', { required: true })}
            type="text"
            className="input input-bordered font-bold lowercase text-xs focus:input-primary"
            placeholder="slug-da-academia"
          />
        </div>

        {/* E-mail de Contato */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-[10px] font-black uppercase text-base-content/60">E-mail de Contato</span>
          </label>
          <input
            {...register('contact_email')}
            type="email"
            className="input input-bordered font-bold lowercase text-xs focus:input-primary"
            placeholder="contato@academia.com"
          />
        </div>

        {/* Endereço */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text text-[10px] font-black uppercase text-base-content/60">Endereço Físico</span>
          </label>
          <input
            {...register('address')}
            type="text"
            className="input input-bordered font-bold uppercase text-xs focus:input-primary"
            placeholder="RUA, NÚMERO, BAIRRO"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className="btn btn-primary px-8 font-black italic uppercase shadow-lg shadow-primary/20 gap-2"
        >
          {isUpdating ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}