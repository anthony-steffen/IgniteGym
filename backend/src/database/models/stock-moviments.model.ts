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
import { Product } from './product.model';
import { Tenant } from './tenant.model';

export class StockMovement extends Model<
  InferAttributes<StockMovement, { omit: 'product' | 'tenant' }>,
  InferCreationAttributes<StockMovement, { omit: 'product' | 'tenant' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare product_id: string;
  declare quantity: number; // Positivo para entrada, negativo para saída
  declare type: 'INPUT' | 'OUTPUT' | 'SALE' | 'ADJUSTMENT';
  declare reason: string | null;

  // 🔗 ASSOCIAÇÕES TIPADAS (Intellisense)
  declare product?: NonAttribute<Product>;
  declare tenant?: NonAttribute<Tenant>;

  declare static associations: {
    product: Association<StockMovement, Product>;
    tenant: Association<StockMovement, Tenant>;
  };
}

StockMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tenant_id: {
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
    type: {
      type: DataTypes.ENUM('INPUT', 'OUTPUT', 'SALE', 'ADJUSTMENT'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'stock_movements',
    underscored: true,
    timestamps: true,
  }
);