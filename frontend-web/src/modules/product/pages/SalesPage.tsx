import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { useInventory } from '../../../hooks/useInventory';
import { useStudents } from '../../../hooks/useStudents';
import { useSales, type SalePaymentMethod } from '../../../hooks/useSales';
import type { Product } from '../types';
import type { Student } from '../../student/types';
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
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ApiErrorResponse {
  message?: string;
}

export function SalesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products, isLoading } = useInventory();
  const { students } = useStudents(slug);
  const { createSale, isCreatingSale } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>('PIX');
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const ITEMS_PER_PAGE = 20;

  const stockByProduct = useMemo(
    () => new Map(products.map((product) => [product.id, Number(product.stock_quantity)])),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalized = searchTerm.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(normalized) ||
      p.category?.name.toLowerCase().includes(normalized) ||
      p.supplier?.name.toLowerCase().includes(normalized)
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const addToCart = (product: Product) => {
    setCart((current) => {
      const maxStock = Number(product.stock_quantity || 0);
      if (maxStock <= 0) return current;

      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        if (exists.quantity >= maxStock) return current;
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

  const updateQuantity = (id: string, delta: number) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        const maxStock = stockByProduct.get(id) ?? 0;
        const nextQty = item.quantity + delta;
        if (nextQty <= 0) return [];
        if (nextQty > maxStock) return [item];
        return [{ ...item, quantity: nextQty }];
      })
    );
  };

  const totalCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );

  const handleFinalizeSale = async () => {
    if (cart.length === 0 || isCreatingSale) return;
    setMessage(null);

    try {
      await createSale({
        studentId: studentId || undefined,
        paymentMethod,
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });

      setCart([]);
      setStudentId('');
      setPaymentMethod('PIX');
      setMessage({ type: 'success', text: 'Venda finalizada com sucesso.' });
      setIsCartOpen(false);
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;
      setMessage({
        type: 'error',
        text: apiError.response?.data?.message || 'Erro ao finalizar venda.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4 uppercase font-black italic">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        Sincronizando PDV...
      </div>
    );
  }

  return (
    <div className="drawer drawer-end h-[calc(100vh-120px)] overflow-hidden mx-auto w-full">
      <input
        id="cart-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isCartOpen}
        onChange={() => setIsCartOpen(!isCartOpen)}
      />

      <div className="drawer-content flex flex-col 2xl:flex-row gap-6 p-2 md:p-6 h-full lg:w-[95%] 2xl:w-[90%] mx-auto">
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black italic uppercase flex items-center gap-2 min-w-0">
                <Package size={28} className="text-primary" /> Catalogo
              </h1>
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn btn-primary btn-sm 2xl:hidden font-black italic gap-2">
                <ShoppingCart size={16} /> {cart.length} ITENS
              </button>
            </div>
            <div className="flex w-full">
              <label className="input sm:w-[70%]">
                <Search size={16} className="opacity-50" />
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

          {message && (
            <div className={`alert mb-4 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span className="text-xs font-bold">{message.text}</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-6 gap-3 pb-24 w-full h-screen">
            {paginatedItems.map((product) => (
              <div
                key={product.id}
                className="card bg-white shadow-sm border border-white hover:border-primary transition-all rounded-xl overflow-hidden max-w-50 h-90 md:h-100">
                <div className="aspect-square bg-gray-50 relative h-60 md:h-70 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-scale-down"
                    />
                  ) : (
                    <Package size={32} className="text-gray-200" />
                  )}
                  {product.category && (
                    <div className="absolute bottom-1 center bg-primary text-white text-[8px] px-1 rounded font-bold uppercase items-center">
                      {product.category.name}
                    </div>
                  )}
                </div>
                <div className="card-body p-2 flex flex-col items-center">
                  <div className="text-center w-full">
                    <p className="text-[8px] text-gray-400 font-bold uppercase truncate">
                      {product.supplier?.name}
                    </p>
                    <h2 className="text-[10px] font-black uppercase italic leading-tight h-8 line-clamp-2 text-gray-600">
                      {product.name}
                    </h2>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 w-full text-center">
                    <div className="flex justify-between w-full items-center px-1">
                      <div className="bg-black text-white px-2 py-0.5 rounded font-black italic text-[10px]">
                        R$ {Number(product.price).toFixed(2)}
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 uppercase">
                        {product.stock_quantity} UN
                      </span>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      disabled={Number(product.stock_quantity) <= 0}
                      className="btn btn-primary btn-xs btn-block font-black italic uppercase">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center py-4 border-gray-100 mt-auto">
            <div className="join">
              <button
                className="join-item btn btn-xs btn-outline"
                onClick={() => setCurrentPage((p) => p - 1)}
                aria-label="Pagina anterior"
                title="Pagina anterior"
                disabled={currentPage === 1}>
                <ChevronLeft size={16} />
              </button>
              <button className="join-item btn btn-xs btn-outline no-animation font-black italic uppercase">
                Pag {currentPage}
              </button>
              <button
                className="join-item btn btn-xs btn-outline"
                onClick={() => setCurrentPage((p) => p + 1)}
                aria-label="Proxima pagina"
                title="Proxima pagina"
                disabled={currentPage === totalPages || totalPages === 0}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <aside className="hidden 2xl:flex w-96 bg-white border-2 border-base-200 rounded-3xl flex-col overflow-hidden shadow-2xl">
          <CartContent
            cart={cart}
            setCart={setCart}
            total={totalCart}
            updateQty={updateQuantity}
            onClose={() => {}}
            isMobile={false}
            students={students}
            studentId={studentId}
            setStudentId={setStudentId}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onFinalize={handleFinalizeSale}
            isFinalizing={isCreatingSale}
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
            students={students}
            studentId={studentId}
            setStudentId={setStudentId}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onFinalize={handleFinalizeSale}
            isFinalizing={isCreatingSale}
          />
        </div>
      </div>
    </div>
  );
}

type CartContentProps = {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  total: number;
  updateQty: (id: string, delta: number) => void;
  onClose: () => void;
  isMobile: boolean;
  students: Student[];
  studentId: string;
  setStudentId: (id: string) => void;
  paymentMethod: SalePaymentMethod;
  setPaymentMethod: (method: SalePaymentMethod) => void;
  onFinalize: () => void;
  isFinalizing: boolean;
};

function CartContent({
  cart,
  setCart,
  total,
  updateQty,
  onClose,
  isMobile,
  students,
  studentId,
  setStudentId,
  paymentMethod,
  setPaymentMethod,
  onFinalize,
  isFinalizing,
}: CartContentProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 bg-gray-50 flex justify-between items-center border-b-2">
        <h2 className="font-black italic uppercase flex items-center gap-2 text-base text-gray-800 tracking-tighter">
          <ShoppingCart size={20} className="text-primary" /> Itens Selecionados
        </h2>
        {isMobile && (
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm" aria-label="Fechar carrinho" title="Fechar carrinho">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-3 border-b border-base-200">
        <select
          className="select select-bordered select-sm w-full font-bold text-xs"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
        >
          <option value="">Venda avulsa (sem aluno)</option>
          {students.map((student: Student) => (
            <option key={student.id} value={student.id}>
              {student.user?.name}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered select-sm w-full font-bold text-xs"
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value as SalePaymentMethod)}
        >
          <option value="PIX">PIX</option>
          <option value="CASH">Dinheiro</option>
          <option value="CREDIT_CARD">Cartao de Credito</option>
          <option value="DEBIT_CARD">Cartao de Debito</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 italic font-black uppercase text-xs opacity-50">
            Carrinho Vazio
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-black uppercase italic leading-tight text-gray-700 flex-1 pr-4">
                  {item.name}
                </span>
                <button
                  onClick={() => setCart((c) => c.filter((i) => i.id !== item.id))}
                  className="btn btn-ghost btn-xs text-error p-0 h-auto min-h-0"
                  aria-label={`Remover ${item.name} do carrinho`}
                  title="Remover item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="join border border-gray-200 rounded-lg bg-white">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="join-item btn btn-xs btn-ghost px-2 text-primary"
                    aria-label={`Diminuir quantidade de ${item.name}`}
                    title="Diminuir quantidade"
                  >
                    <Minus size={12} strokeWidth={3} />
                  </button>
                  <span className="join-item px-4 flex items-center text-xs font-black italic border-x text-gray-800 border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="join-item btn btn-xs btn-ghost px-2 text-primary"
                    aria-label={`Aumentar quantidade de ${item.name}`}
                    title="Aumentar quantidade"
                  >
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
          onClick={onFinalize}
          disabled={cart.length === 0 || isFinalizing}
          className="btn btn-primary btn-block bg-base-200 h-16 font-black italic uppercase text-lg shadow-xl shadow-primary/10 gap-3 border-none">
          {isFinalizing ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <CheckCircle2 size={24} strokeWidth={3} />
          )}
          Finalizar Venda
        </button>
      </div>
    </div>
  );
}
