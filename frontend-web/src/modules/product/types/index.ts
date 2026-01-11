
export interface Product {
  is_active: boolean;
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: string;
  image_url?: string; // 🚀 Adicionado
  category?: {
    name: string;
  };
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  initialStock?: number;
  image_url?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface StockMovementData {
  productId: string;
  quantity: number;
  type: 'INPUT' | 'OUTPUT';
  reason: string;
}