/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSuppliers } from "../../../hooks/useSuppliers";
import { SupplierModal } from "../components/SupplierModal";
import { Plus, Trash2, Building2, Pencil, Mail, Phone } from "lucide-react";
import type { Supplier } from "../types";

export function SupplierPage() {
  const { suppliers, isLoading, deleteSupplier, createSupplier, updateSupplier } = useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleOpenModal = (supplier: Supplier | null = null) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedSupplier) {
        await updateSupplier(data);
      } else {
        await createSupplier(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar marca:", error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Deseja excluir permanentemente a marca "${name.toUpperCase()}"?`)) {
      await deleteSupplier(id);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <span className="uppercase font-black italic animate-pulse text-gray-400">
        Sincronizando Marcas...
      </span>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-start gap-3">
          <Building2 className="text-primary" size={35} />
          <h1 className="text-2xl font-black italic uppercase text-base-content leading-none">
            Marcas
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Fabricantes</p>
          </h1>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary font-black italic uppercase text-[11px]">
          <Plus size={12} strokeWidth={4} /> 
          Fornecedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all group">
            <div className="card-body p-5">
              <div className="flex justify-between items-start">
                <h2 className="card-title font-black italic uppercase text-sm">
                  {supplier.name}
                </h2>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(supplier)} className="btn btn-square btn-ghost btn-xs text-info">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(supplier.id, supplier.name)} className="btn btn-square btn-ghost btn-xs text-error">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 font-medium line-clamp-2 min-h-[2.5rem] mt-1">
                {supplier.description || "Sem descrição disponível."}
              </p>

              <div className="card-actions justify-start gap-4 border-t border-dashed pt-2 mt-2 border-base-300">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                  <Mail size={12} className="text-primary" /> {supplier.email || '---'}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                  <Phone size={12} className="text-primary" /> {supplier.phone || '---'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SupplierModal 
        key={selectedSupplier?.id ?? 'new'} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        selectedSupplier={selectedSupplier}
      />
    </div>
  );
}