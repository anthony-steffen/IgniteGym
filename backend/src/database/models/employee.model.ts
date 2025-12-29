// src/database/models/employee.model.ts
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
import { Tenant } from './tenant.model';

export class Employee extends Model<
  InferAttributes<Employee, { omit: 'user' | 'tenant' }>,
  InferCreationAttributes<Employee, { omit: 'user' | 'tenant' }>
> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare tenant_id: string; // Adicionado para consistência multi-tenant
  declare role_title: string;
  declare is_active: boolean;

  // ✅ ASSOCIAÇÕES TIPADAS
  declare user?: NonAttribute<User>;
  declare tenant?: NonAttribute<Tenant>;

  declare static associations: {
    user: Association<Employee, User>;
    tenant: Association<Employee, Tenant>;
  };
}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'employees',
    underscored: true,
    timestamps: true,
  }
);