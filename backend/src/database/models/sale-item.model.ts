import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Sale } from './sale.model';
import { Product } from './product.model';

export class SaleItem extends Model<
  InferAttributes<SaleItem, { omit: 'sale' | 'product' }>,
  InferCreationAttributes<SaleItem, { omit: 'sale' | 'product' }>
> {
  declare id: CreationOptional<string>;
  declare sale_id: string;
  declare product_id: string;
  declare quantity: number;
  declare unit_price: number;
  declare subtotal: number;

  // 🔗 ASSOCIAÇÕES TIPADAS
  declare sale?: NonAttribute<Sale>;
  declare product?: NonAttribute<Product>;

  declare static associations: {
    sale: Association<SaleItem, Sale>;
    product: Association<SaleItem, Product>;
  };
}

SaleItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    sale_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'sale_items',
    underscored: true,
    timestamps: true,
  }
);