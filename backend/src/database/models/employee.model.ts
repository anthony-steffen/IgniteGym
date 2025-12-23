import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../sequelize';

export class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare tenant_id: string;
  declare role_title: string;
  declare hire_date: Date | null;
  declare permissions: Record<string, boolean> | null;
}

Employee.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'employees',
    underscored: true,
    timestamps: true,
  }
);