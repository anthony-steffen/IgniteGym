import { useState } from 'react';
import { useInventory } from '../../../hooks/useInventory';
import type { Product } from '../types';
import { ProductModal } from '../components/ProductMdal';

export function ProductPage() {
  const { products, isLoading, deleteProduct } = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = (product: Product | null = null) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  if (isLoading) return <div className="p-10 text-center uppercase font-black italic animate-pulse">Carregando Inventário...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black italic uppercase">Estoque</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary font-black italic uppercase">+ Novo</button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr className="text-gray-500 font-black uppercase text-xs">
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="text-black font-bold">{product.name}</td>
                <td className="font-mono text-gray-600">{product.stock_quantity} UN</td>
                <td className="font-bold text-gray-800">R$ {product.price}</td>
                <td className="flex justify-center gap-2">
                  <button onClick={() => handleOpenModal(product)} className="btn btn-sm btn-ghost">📝</button>
                  <button onClick={() => deleteProduct(product.id)} className="btn btn-sm btn-ghost text-error">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
}