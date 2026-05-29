import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'lucide-react';
import type { Product, CreateProductData } from '../types';
import { useInventory } from '../../../hooks/useInventory';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { register, handleSubmit, reset } = useForm<CreateProductData>();
  const { createProduct, updateProduct, categories, suppliers, isSaving } = useInventory();

  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category_id: product.category_id,
        supplier_id: product.supplier_id,
        image_url: product.image_url || '',
      });
      return;
    }

    reset({ name: '', description: '', price: 0, category_id: '', supplier_id: '', initialStock: 0, image_url: '' });
  }, [product, reset, isOpen]);

  const onSubmit = async (data: CreateProductData) => {
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        initialStock: Number(data.initialStock || 0),
      };

      if (product) {
        await updateProduct({ id: product.id, ...payload });
      } else {
        await createProduct(payload);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-lg">
        <header className="mb-6">
          <h3 className="font-black italic uppercase text-2xl text-primary">
            {product ? 'Editar Produto' : 'Novo Item'}
          </h3>
          <p className="text-[10px] text-base-content/60 font-bold uppercase tracking-widest">
            Sincronizado com catalogo de produtos
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Nome do produto</span>
            </label>
            <input
              {...register('name', { required: true })}
              className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold"
              placeholder="Ex: Whey Protein 900g"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-base-content/70">Preco (R$)</span>
              </label>
              <input
                {...register('price', { required: true })}
                type="number"
                step="0.01"
                className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-mono font-bold"
              />
            </div>

            {!product && (
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-black uppercase text-[10px] text-base-content/70">Estoque inicial</span>
                </label>
                <input
                  {...register('initialStock')}
                  type="number"
                  className="input input-bordered w-full bg-base-100 text-base-content border-base-300 font-bold"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-base-content/70">Categoria</span>
              </label>
              <select
                {...register('category_id', { required: true })}
                className="select select-bordered w-full bg-base-100 text-base-content border-base-300 font-bold"
                defaultValue=""
              >
                <option value="" disabled>Selecione...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-base-content/70">Marca / fornecedor</span>
              </label>
              <select
                {...register('supplier_id', { required: true })}
                className="select select-bordered w-full bg-base-100 text-base-content border-base-300 font-bold"
                defaultValue=""
              >
                <option value="" disabled>Selecione...</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Descricao opcional</span>
            </label>
            <textarea
              {...register('description')}
              className="textarea textarea-bordered bg-base-100 text-base-content border-base-300 h-20"
              placeholder="Detalhes tecnicos ou observacoes..."
            />
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-base-content/70">Link da imagem (URL)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                <Link size={16} />
              </span>
              <input
                {...register('image_url')}
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content border-base-300 font-bold focus:border-primary text-xs"
              />
              <p className="text-[10px] mt-1 text-base-content/60 italic">
                Dica: use links diretos (CDN, site oficial ou repositorio de imagens).
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost border border-base-300 font-black uppercase italic text-xs px-6">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary px-8 font-black uppercase italic shadow-lg shadow-primary/20"
            >
              {isSaving ? <span className="loading loading-spinner"></span> : 'Salvar produto'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
