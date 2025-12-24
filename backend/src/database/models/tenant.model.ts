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
import { User } from './user.model';

export class Tenant extends Model<
  InferAttributes<Tenant, { omit: 'users' }>,
  InferCreationAttributes<Tenant, { omit: 'users' }>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare contact_email: string | null;
  declare address: string | null;
  declare timezone: string;
  declare is_active: CreationOptional<boolean>;

  // 🔗 ASSOCIAÇÃO TIPADA
  declare users?: NonAttribute<User[]>;

  declare static associations: {
    users: Association<Tenant, User>;
  };
}

Tenant.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'America/Sao_Paulo',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'tenants',
    underscored: true,
    timestamps: true,
  }
);
