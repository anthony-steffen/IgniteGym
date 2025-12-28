import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association } from 'sequelize';
import { sequelize } from '../sequelize';
import { Product } from './product.model';

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<string>;
  declare name: string;

  // Uma categoria tem muitos produtos
  declare products?: NonAttribute<Product[]>;

  declare static associations: {
    products: Association<Category, Product>;
  };
}

Category.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  sequelize,
  tableName: 'categories',
  underscored: true,
  timestamps: true,
});