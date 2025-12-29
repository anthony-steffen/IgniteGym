export interface CreateProductDTO {
  tenantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  initialStock?: number;
}

export interface UpdateStockDTO {
  tenantId: string;
  productId: string;
  quantity: number; // Ex: 10 para entrada, -5 para saída
  type: 'INPUT' | 'OUTPUT' | 'SALE' | 'ADJUSTMENT';
  reason?: string;
}

export interface RemoveProductDTO {
  tenantId: string;
  productId: string;
}