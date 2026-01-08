export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
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

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id: string;
  initialStock?: number;
}