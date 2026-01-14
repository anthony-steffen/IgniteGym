import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Product, CreateProductData } from '../types';
import { useInventory } from '../../../hooks/useInventory';
import { Link } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { register, handleSubmit, reset } = useForm<CreateProductData>();
  const { createProduct, updateProduct, categories, suppliers, isSaving } = useInventory();
  
  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name,
          description: product.description || '',
          price: product.price,
          category_id: product.category_id,
          supplier_id: product.supplier_id,
          image_url: product.image_url || '',
        });
      } else {
        reset({ name: '', description: '', price: 0, category_id: '', supplier_id: '', initialStock: 0, image_url: '' });
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
            Sincronizado com Catálogo de Produtos Central
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Nome do Produto</span>
            </label>
            <input 
              {...register('name', { required: true })} 
              className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold" 
              placeholder="Ex: Whey Protein 900g" 
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
                className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-mono font-bold" 
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
                  className="input input-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold" 
                />
              </div>
            )}
          </div>

          {/* Grid para Categorias e Fornecedores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Categoria</span>
              </label>
              <select 
                {...register('category_id', { required: true })} 
                className="select select-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold"
                defaultValue=""
              >
                <option value="" disabled>Selecione...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-black uppercase text-[10px] text-gray-500">Marca/Fornecedor</span>
              </label>
              <select 
                {...register('supplier_id', { required: true })} 
                className="select select-bordered w-full bg-gray-50 text-gray-800 border-2 font-bold"
                defaultValue=""
              >
                <option value="" disabled>Selecione...</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>{sup.name.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Descrição Opcional</span>
            </label>
            <textarea 
              {...register('description')} 
              className="textarea textarea-bordered bg-gray-50 text-gray-800 border-2 h-20" 
              placeholder="Detalhes técnicos ou observações..."
            />
          </div>

          {/* Preview da Imagem */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text font-black uppercase text-[10px] text-gray-500">Link da Imagem (URL)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Link size={16} />
              </span>
              <input 
                {...register('image_url')} 
                type="url" 
                placeholder="https://exemplo.com/imagem.jpg" 
                className="input input-bordered w-full pl-10 font-bold focus:border-primary text-xs"
              />
              <p className="text-[10px] mt-1 text-gray-400 italic">
                Dica: Você pode usar links do Imgur, Pinterest ou do seu próprio site.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <button type="button" onClick={onClose} className="btn bg-black text-white hover:bg-gray-800 font-black uppercase italic text-xs px-6">
              CANCELAR
            </button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="btn btn-primary px-8 font-black uppercase italic shadow-lg shadow-primary/20"
            >
              {isSaving ? <span className="loading loading-spinner"></span> : 'SALVAR PRODUTO'}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}