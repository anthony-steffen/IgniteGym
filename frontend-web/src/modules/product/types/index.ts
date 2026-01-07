export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: string;
  category?: Category;
}

export interface StockMovementData {
  productId: string;
  quantity: number;
  type: 'INPUT' | 'OUTPUT';
  reason: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  initialStock?: number;
}