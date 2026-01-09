import { useState } from "react";
import { useInventory } from "../../../hooks/useInventory";
import type { Product } from "../types";
import { ProductModal } from "../components/ProductMdal";
import { Plus, Pencil, Trash2, PackageSearch } from "lucide-react";

export function ProductPage() {
	const { products, isLoading, deleteProduct } = useInventory();
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const handleOpenModal = (product: Product | null = null) => {
		setSelectedProduct(product);
		setModalOpen(true);
	};

	const handleDelete = async (id: string, name: string) => {
		if (
			window.confirm(
				`Tem certeza que deseja excluir o produto "${name.toUpperCase()}"?`
			)
		) {
			try {
				await deleteProduct(id);
			} catch (error) {
				console.error("Erro ao excluir o produto:", error);
				// O erro já é tratado globalmente ou via toast pelo TanStack Query
			}
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-20 gap-4">
				<div className="loading loading-spinner loading-lg text-primary"></div>
				<span className="uppercase font-black italic animate-pulse text-gray-400">
					Sincronizando Inventário...
				</span>
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Header da Página */}
			<div className="flex justify-between">
				<div className="flex items-start gap-3">
					<PackageSearch className="text-primary" size={35} />
					<h1 className="text-2xl font-black italic uppercase text-base-content">
						Estoque
						<p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
							Gestão de produtos
						</p>
					</h1>
				</div>

				<button
					onClick={() => handleOpenModal()}
					className="btn btn-primary font-black italic uppercase text-[11px] p-2">
					<Plus size={10} strokeWidth={5} />
					Novo Produto
				</button>
			</div>

			{/* Tabela de Produtos */}
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
						{products.map((product) => (
							<tr
								key={product.id}
								className="hover:bg-gray-50 border-b border-gray-100">
								<td className="font-semibold text-gray-800">{product.name}</td>
								<td className="font-semibold text-gray-800">
									{product.stock_quantity} UN
								</td>
								<td className="font-semibold text-gray-800">
									R$ {product.price}
								</td>
								<td>
									<div className="flex justify-center items-center ">
										<button
											onClick={() => handleOpenModal(product)}
											className="btn btn-square btn-ghost btn-sm text-gray-400 hover:text-primary transition-colors"
											title="Editar Produto">
											<Pencil size={18} className="text-info" />
										</button>
										<button
											onClick={() => handleDelete(product.id, product.name)}
											className="btn btn-square btn-ghost btn-sm text-gray-300 hover:text-error transition-colors"
											title="Excluir Produto">
											<Trash2 size={18} className="text-error" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal Integrado */}
			<ProductModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				product={selectedProduct}
			/>
		</div>
	);
}
