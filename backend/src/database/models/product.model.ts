import { 
  Model, DataTypes, InferAttributes, InferCreationAttributes, 
  CreationOptional, NonAttribute, Association 
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Category } from './category.model';
import { Tenant } from './tenant.model';
import { Supplier } from './supplier.model'; // Importação do novo modelo

export class Product extends Model<
  InferAttributes<Product, { omit: 'category' | 'tenant' | 'supplier' }>, 
  InferCreationAttributes<Product, { omit: 'category' | 'tenant' | 'supplier' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare category_id: string;
  declare supplier_id: string | null;
  declare name: string;
  declare description: string | null;
  declare price: number;
  declare stock_quantity: CreationOptional<number>;
  declare is_active: CreationOptional<boolean>;
  declare image_url: string | null;

  // 🔗 Associações tipadas (Intellisense)
  declare category?: NonAttribute<Category>;
  declare tenant?: NonAttribute<Tenant>;
  declare supplier?: NonAttribute<Supplier>;

  declare static associations: {
    category: Association<Product, Category>;
    tenant: Association<Product, Tenant>;
    supplier: Association<Product, Supplier>;
  };
}

Product.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  tenant_id: { type: DataTypes.UUID, allowNull: false },
  category_id: { type: DataTypes.UUID, allowNull: false },
  supplier_id: { 
    type: DataTypes.UUID, 
    allowNull: true,
    references: { model: 'suppliers', key: 'id' } 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock_quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  image_url: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  tableName: 'products',
  underscored: true,
  timestamps: true,
});