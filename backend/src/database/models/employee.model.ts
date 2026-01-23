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
  declare tenant_id: string;
  declare role_title: string;
  declare is_active: CreationOptional<boolean>;

  // 🚀 AQUI ESTÁ A CORREÇÃO:
  // Usamos CreationOptional e o tipo correto para bater com a Migration
  declare salary: CreationOptional<number>;
  declare weekly_hours: CreationOptional<number>;
  declare work_schedule: CreationOptional<any>; // 'any' ou 'object' para aceitar o JSON do front

  // ASSOCIAÇÕES TIPADAS
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
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Compatível com CreationOptional
    },
    weekly_hours: {
      type: DataTypes.INTEGER,
      allowNull: true, // Compatível com CreationOptional
    },
    work_schedule: {
      type: DataTypes.JSON, // Compatível com o objeto vindo do Front
      allowNull: true,
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