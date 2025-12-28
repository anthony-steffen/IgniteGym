import { Product } from '../product.model';
import { Category } from '../category.model';
import { Tenant } from '../tenant.model';
import { StockMovement } from '../stock-moviments.model';
import { AssociationConfig } from './types'; // Seguindo seu padrão de tipos

export const inventoryAssociations: AssociationConfig[] = [
  // === CATEGORY & PRODUCT ===
  {
    source: Product,
    type: 'belongsTo',
    target: Category,
    options: { foreignKey: 'category_id', as: 'category' },
  },
  {
    source: Category,
    type: 'hasMany',
    target: Product,
    options: { foreignKey: 'category_id', as: 'products' },
  },

  // === PRODUCT & STOCK MOVEMENT ===
  {
    source: StockMovement,
    type: 'belongsTo',
    target: Product,
    options: { foreignKey: 'product_id', as: 'product' },
  },
  {
    source: Product,
    type: 'hasMany',
    target: StockMovement,
    options: { foreignKey: 'product_id', as: 'movements' },
  },

  // === RELAÇÕES COM TENANT ===
  {
    source: Product,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },
  {
    source: StockMovement,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },
];