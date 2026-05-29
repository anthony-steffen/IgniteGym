import { useState } from 'react';
import { Plus, Pencil, Trash2, PackageSearch } from 'lucide-react';
import { useInventory } from '../../../hooks/useInventory';
import type { Product } from '../types';
import { ProductModal } from '../components/ProductMdal';
import { IconActionButton } from '../../../shared/components/IconActionButton';

export function ProductPage() {
  const { products, isLoading, isError, hasValidSlug, deleteProduct } = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = (product: Product | null = null) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${name.toUpperCase()}"?`)) return;

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('Erro ao excluir o produto:', error);
    }
  };

  if (!hasValidSlug) {
    return (
      <div className="alert alert-warning">
        <span className="text-xs font-bold uppercase">
          Unidade invalida na URL. Volte para o dashboard da unidade e tente novamente.
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <span className="uppercase font-black italic animate-pulse text-base-content/60">
          Sincronizando inventario...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span className="text-xs font-bold uppercase">
          Nao foi possivel carregar o inventario desta unidade.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <PackageSearch className="text-primary" size={35} />
          <h1 className="text-xl sm:text-2xl font-black italic uppercase text-base-content leading-tight">
            Estoque
            <p className="text-[10px] font-bold text-base-content/60 uppercase tracking-widest mt-1">
              Gestao de produtos
            </p>
          </h1>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary font-black italic uppercase text-[11px] p-2 w-full sm:w-auto">
          <Plus size={10} strokeWidth={5} />
          Novo Produto
        </button>
      </div>

      <div className="rounded-lg shadow border border-base-300 overflow-hidden bg-base-100">
        <table className="table w-full">
          <thead className="bg-base-200/60">
            <tr className="text-base-content/60 font-black uppercase text-xs">
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preco</th>
              <th className="text-center">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-base-200/40 border-b border-base-200">
                <td className="font-semibold text-base-content">{product.name}</td>
                <td className="font-semibold text-base-content">{product.stock_quantity} UN</td>
                <td className="font-semibold text-base-content">R$ {product.price}</td>
                <td>
                  <div className="flex justify-center items-center">
                    <IconActionButton
                      label="Editar produto"
                      tone="info"
                      size="sm"
                      onClick={() => handleOpenModal(product)}
                      icon={<Pencil size={18} />}
                    />
                    <IconActionButton
                      label="Excluir produto"
                      tone="error"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
                      icon={<Trash2 size={18} />}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal isOpen={modalOpen} onClose={() => setModalOpen(false)} product={selectedProduct} />
    </div>
  );
}
