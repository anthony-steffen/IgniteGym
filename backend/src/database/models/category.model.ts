import { 
  Model, DataTypes, InferAttributes, InferCreationAttributes, 
  CreationOptional, NonAttribute, Association 
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Product } from './product.model';

export class Category extends Model<
  InferAttributes<Category, { omit: 'products' }>, 
  InferCreationAttributes<Category, { omit: 'products' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare name: string;

  declare products?: NonAttribute<Product[]>;

  declare static associations: {
    products: Association<Category, Product>;
  };
}

Category.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  tenant_id: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  tableName: 'categories',
  underscored: true,
  timestamps: true,
});