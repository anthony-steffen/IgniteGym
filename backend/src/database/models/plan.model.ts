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
import { Tenant } from './tenant.model';

export class Plan extends Model<
  InferAttributes<Plan, { omit: 'tenant' }>,
  InferCreationAttributes<Plan, { omit: 'tenant' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;

  declare name: string;
  declare price: number;
  declare duration_days: number;
  
  declare is_active: CreationOptional<boolean>;


  // 🔗 ASSOCIAÇÃO TIPADA
  declare tenant?: NonAttribute<Tenant>;

  declare static associations: {
    tenant: Association<Plan, Tenant>;
  };
}

Plan.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'plans',
    underscored: true,
    timestamps: true,
  }
);