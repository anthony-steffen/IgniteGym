// === Tipos para a rota /inventory/products ===

export interface CreateProductDTO {
  tenantId: string;
  category_id: string;
  supplier_id?: string;
  name: string;
  description?: string;
  price: number;
  initialStock?: number;
  image_url?: string;
}

export interface UpdateProductDTO {
  tenantId: string;
  productId: string;
  category_id?: string;
  supplier_id?: string;
  name?: string;
  price?: number;
  description?: string;
  is_active?: boolean;
  image_url?: string;
}

export interface UpdateStockDTO {
  tenantId: string;
  productId: string;
  quantity: number; 
  type: 'INPUT' | 'OUTPUT' | 'SALE' | 'ADJUSTMENT';
  reason?: string;
}

export interface RemoveProductDTO {
  tenantId: string;
  productId: string;
}

// === Tipos para a rota /categories ===

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  id: string;
  name: string;
}

export interface ListCategoryDTO {
  name?: string;
}

// === Tipos para a rota /suppliers ===
export interface CreateSupplierDTO {
  tenantId: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface UpdateSupplierDTO {
  tenantId: string;
  id: string;
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export interface ListSupplierDTO {
  name?: string;
  is_active?: boolean;
}