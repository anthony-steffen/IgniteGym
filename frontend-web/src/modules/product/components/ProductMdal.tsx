import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Product, CreateProductData } from '../types';
import { useInventory } from '../../../hooks/useInventory';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { register, handleSubmit, reset } = useForm<CreateProductData>();
  const { createProduct, updateProduct, categories, isSaving } = useInventory();

  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          description: product.description || '',
          price: product.price,
          category_id: product.category_id,
        });
      } else {
        reset({ name: '', description: '', price: 0, category_id: '', initialStock: 0 });
      }
    }
  }, [product, reset, isOpen]);

  const onSubmit = async (data: CreateProductData) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        initialStock: Number(data.initialStock || 0)
      };
      
      if (product) {
        await updateProduct({ id: product.id, ...payload });
      } else {
        await createProduct(payload);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {product ? '📝 Editar Produto' : '🚀 Novo Item'}
          </h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Sincronizado com Banco de Dados Central
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nome</span>
            </label>
            <input 
              {...register('name', { required: true })} 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold" 
              placeholder="Ex: Luvas de Treino G" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Preço (R$)</span>
              </label>
              <input 
                {...register('price', { required: true })} 
                type="number" step="0.01" 
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-mono" 
                placeholder="0.00" 
              />
            </div>

            {!product && (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-black uppercase text-[10px] text-gray-500">Estoque Inicial</span>
                </label>
                <input 
                  {...register('initialStock')} 
                  type="number" 
                  className="input input-bordered w-full bg-gray-50 text-gray-800 border-2" 
                  placeholder="0" 
                />
              </div>
            )}
          </div>

          {/* 🚀 SELECT DINÂMICO DE CATEGORIAS */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Categoria</span>
            </label>
            <select 
              {...register('category_id', { required: true })} 
              className="select select-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold"
              defaultValue=""
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.toUpperCase()}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-[9px] text-error mt-1 italic font-bold">Nenhuma categoria encontrada no banco.</p>
            )}
          </div>

            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Descrição Opcional</span>
            </label>
          <div className="form-control">
            <textarea 
              {...register('description')} 
              className="textarea textarea-bordered bg-gray-50 text-gray-800 border-2 h-20" 
              placeholder="Detalhes sobre o produto..."
            ></textarea>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <button type="button" onClick={onClose} className="btn bg-base-300 font-black uppercase italic text-xs">Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="btn btn-primary px-4 font-black uppercase italic shadow-lg shadow-primary/20"
            >
              {isSaving ? <span className="loading loading-spinner"></span> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}