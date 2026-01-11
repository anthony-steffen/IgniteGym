/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useInventory } from "../../../hooks/useInventory";
import {
	ShoppingCart,
	Plus,
	Search,
	Package,
	Trash2,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Minus,
	X,
} from "lucide-react";

interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export function SalesPage() {
	const { products, isLoading } = useInventory();
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [isCartOpen, setIsCartOpen] = useState(false);

	const ITEMS_PER_PAGE = 20;

	// 1. Lógica de Filtro e Busca
	const filteredProducts = useMemo(() => {
		return products.filter((p) =>
			p.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [products, searchTerm]);

	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
	const paginatedItems = filteredProducts.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE
	);

	// 2. Lógica de Adicionar ao Carrinho
	const addToCart = (product: any) => {
		setCart((current) => {
			const exists = current.find((item) => item.id === product.id);
			if (exists) {
				return current.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [
				...current,
				{
					id: product.id,
					name: product.name,
					price: Number(product.price),
					quantity: 1,
				},
			];
		});
	};

	// 3. Atualizar Quantidade (+ / -)
	const updateQuantity = (id: string, delta: number) => {
		setCart((current) =>
			current.map((item) => {
				if (item.id === id) {
					const nextQty = item.quantity + delta;
					return nextQty > 0 ? { ...item, quantity: nextQty } : item;
				}
				return item;
			})
		);
	};

	const totalCart = useMemo(
		() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
		[cart]
	);

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center p-20 gap-4 uppercase font-black italic">
				<span className="loading loading-spinner loading-lg text-primary"></span>
				Sincronizando PDV...
			</div>
		);

	return (
		<div className="drawer drawer-end h-[calc(100vh-120px)] overflow-hidden mx-auto w-full">
			<input
				id="cart-drawer"
				type="checkbox"
				className="drawer-toggle"
				checked={isCartOpen}
				onChange={() => setIsCartOpen(!isCartOpen)}
			/>

			<div className="drawer-content flex flex-col xl:flex-row gap-6 p-2 md:p-6 h-full lg:w-[70%] mx-auto">
				{/* LADO ESQUERDO: CATÁLOGO */}
				<div className="flex-1 flex flex-col min-w-0">
					<header className="flex flex-col gap-4 mb-6">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-black italic uppercase flex items-center gap-2">
								<Package size={28} className="text-primary" /> Catálogo
							</h1>
						<button
							onClick={() => setIsCartOpen(true)}
							className="btn btn-primary btn-sm xl:hidden font-black italic gap-2">
							<ShoppingCart size={16} /> {cart.length} ITENS
						</button>
						</div>
						<div className="flex w-full">
							<label className="input sm:w-[70%]">
								<svg
									className="h-[1em] opacity-50"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24">
									<g
										strokeLinejoin="round"
										strokeLinecap="round"
										strokeWidth="2.5"
										fill="none"
										stroke="currentColor">
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.3-4.3"></path>
									</g>
								</svg>
								<input
									type="search"
									required
									placeholder="Buscar produtos por nome, categoria ou marca"
									onChange={(e) => {
										setSearchTerm(e.target.value);
										setCurrentPage(1);
									}}
								/>
							</label>
						</div>
					</header>

					<div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-3 pb-24 max-w-240">
						{paginatedItems.map((product) => (
							<div
								key={product.id}
								className="card bg-white shadow-sm border border-gray-100 hover:border-primary transition-all rounded-xl overflow-hidden h-70">
								<figure className="aspect-square bg-gray-50 relative h-40">
									{product.image_url ? (
										<img
											src={product.image_url}
											alt={product.name}
											className="object-cover w-full h-full"
										/>
									) : (
										<Package size={32} className="text-gray-200" />
									)}
								</figure>
								<div className="card-body p-3 flex flex-col justify-between items-center">
									<h2 className="text-[10px] font-black uppercase italic leading-tight h-8 line-clamp-2 text-gray-600">
										{product.name}
									</h2>
									<div className="bg-black text-white px-2 py-0.5 rounded font-black italic text-[10px] text-center ">
										R$ {Number(product.price).toFixed(2)}
									</div>
									<button
										onClick={() => addToCart(product)}
										className="btn btn-primary btn-xs btn-block font-black italic uppercase mt-2">
										<Plus size={12} strokeWidth={4} /> Adicionar
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="flex justify-center items-center py-4 border-gray-100 mt-auto">
						<div className="join">
							<button
								className="join-item btn btn-xs btn-outline"
								onClick={() => setCurrentPage((p) => p - 1)}
								disabled={currentPage === 1}>
								<ChevronLeft size={16} />
							</button>
							<button className="join-item btn btn-xs btn-outline no-animation font-black italic uppercase">
								Pág {currentPage}
							</button>
							<button
								className="join-item btn btn-xs btn-outline"
								onClick={() => setCurrentPage((p) => p + 1)}
								disabled={currentPage === totalPages || totalPages === 0}>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>

				<aside className="hidden xl:flex w-80 bg-white border-2 border-base-200 rounded-3xl flex-col overflow-hidden shadow-2xl">
					<CartContent
						cart={cart}
						setCart={setCart}
						total={totalCart}
						updateQty={updateQuantity}
						onClose={() => {}}
						isMobile={false}
					/>
				</aside>
			</div>

			<div className="drawer-side z-100">
				<label htmlFor="cart-drawer" className="drawer-overlay"></label>
				<div className="w-full sm:w-96 h-full bg-white flex flex-col">
					<CartContent
						cart={cart}
						setCart={setCart}
						total={totalCart}
						updateQty={updateQuantity}
						onClose={() => setIsCartOpen(false)}
						isMobile={true}
					/>
				</div>
			</div>
		</div>
	);
}

function CartContent({
	cart,
	setCart,
	total,
	updateQty,
	onClose,
	isMobile,
}: any) {
	return (
		<div className="flex flex-col h-full bg-white">
			<div className="p-6 bg-gray-50 flex justify-between items-center border-b-2">
				<h2 className="font-black italic uppercase flex items-center gap-2 text-base text-gray-800 tracking-tighter">
					<ShoppingCart size={20} className="text-primary" /> Itens Selecionados
				</h2>
				{isMobile && (
					<button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
						<X size={24} />
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{cart.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-gray-300 italic font-black uppercase text-xs opacity-50">
						Carrinho Vazio
					</div>
				) : (
					cart.map((item: any) => (
						<div
							key={item.id}
							className="flex flex-col gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-in slide-in-from-right-4">
							<div className="flex justify-between items-start">
								<span className="text-[11px] font-black uppercase italic leading-tight text-gray-700 flex-1 pr-4">
									{item.name}
								</span>
								<button
									onClick={() =>
										setCart((c: any) => c.filter((i: any) => i.id !== item.id))
									}
									className="btn btn-ghost btn-xs text-error p-0 h-auto min-h-0">
									<Trash2 size={16} />
								</button>
							</div>

							<div className="flex justify-between items-center">
								<div className="join border border-gray-200 rounded-lg bg-white">
									<button
										onClick={() => updateQty(item.id, -1)}
										className="join-item btn btn-xs btn-ghost px-2 text-primary">
										<Minus size={12} strokeWidth={3} />
									</button>
									<span className="join-item px-4 flex items-center text-xs font-black italic border-x text-gray-800 border-gray-300">
										{item.quantity}
									</span>
									<button
										onClick={() => updateQty(item.id, 1)}
										className="join-item btn btn-xs btn-ghost px-2 text-primary">
										<Plus size={12} strokeWidth={3} />
									</button>
								</div>
								<div className="text-right">
									<span className="text-[9px] block font-bold text-gray-400 uppercase tracking-tighter">
										Subtotal
									</span>
									<span className="text-sm font-black italic tracking-tighter text-gray-800">
										R$ {(item.price * item.quantity).toFixed(2)}
									</span>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			<div className="p-8 bg-black text-white">
				<div className="flex justify-between items-end mb-6">
					<div className="flex flex-col">
						<span className="text-[10px] font-bold uppercase italic text-gray-500">
							Valor Total
						</span>
						<span className="text-3xl font-black italic text-primary leading-none tracking-tighter">
							R$ {total.toFixed(2)}
						</span>
					</div>
				</div>
				<button
					disabled={cart.length === 0}
					className="btn btn-primary btn-block h-16 font-black italic uppercase text-lg shadow-xl shadow-primary/10 gap-3 border-none">
					<CheckCircle2 size={24} strokeWidth={3} /> Finalizar Venda
				</button>
			</div>
		</div>
	);
}
