import React, { useEffect } from 'react';
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
  const { createProduct, updateProduct, isSaving } = useInventory();

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
      if (product) {
        await updateProduct({ id: product.id, ...data });
      } else {
        await createProduct(data);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-white border border-gray-200">
        <h3 className="font-black italic uppercase text-lg mb-4 text-black">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name')} className="input input-bordered w-full bg-gray-50 text-black" placeholder="Nome" required />
          <div className="grid grid-cols-2 gap-2">
            <input {...register('price')} type="number" step="0.01" className="input input-bordered bg-gray-50 text-black" placeholder="Preço" required />
            {!product && (
              <input {...register('initialStock')} type="number" className="input input-bordered bg-gray-50 text-black" placeholder="Estoque Inicial" />
            )}
          </div>
          <input {...register('category_id')} className="input input-bordered w-full bg-gray-50 text-black" placeholder="ID da Categoria" required />
          <textarea {...register('description')} className="textarea textarea-bordered w-full bg-gray-50 text-black" placeholder="Descrição"></textarea>
          
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancelar</button>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              {isSaving ? <span className="loading loading-spinner"></span> : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}