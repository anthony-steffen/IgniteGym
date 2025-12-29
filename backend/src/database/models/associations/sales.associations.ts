import { Sale } from '../sale.model';
import { SaleItem } from '../sale-item.model';
import { Product } from '../product.model';
import { Tenant } from '../tenant.model';
import { AssociationConfig } from './types';

export const salesAssociations: AssociationConfig[] = [
  {
    source: Sale,
    type: 'hasMany',
    target: SaleItem,
    options: { foreignKey: 'sale_id', as: 'items' },
  },
  {
    source: SaleItem,
    type: 'belongsTo',
    target: Sale,
    options: { foreignKey: 'sale_id', as: 'sale' },
  },
  {
    source: SaleItem,
    type: 'belongsTo',
    target: Product,
    options: { foreignKey: 'product_id', as: 'product' },
  },
  {
    source: Sale,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },
];