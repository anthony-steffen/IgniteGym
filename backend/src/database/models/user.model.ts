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
import { Employee } from './employee.model';

export class User extends Model<
  InferAttributes<User, { omit: 'employee' }>,
  InferCreationAttributes<User, { omit: 'employee' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string | null;
  declare email: string | null;
  declare password_hash: string;
  declare role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';

  declare name: string | null;
  declare phone: string | null;
  declare last_login_at: Date | null;
  declare is_active: CreationOptional<boolean>;

  // ✅ ASSOCIAÇÃO TIPADA
  declare employee?: NonAttribute<Employee>;

  // (opcional, mas recomendado)
  declare static associations: {
    employee: Association<User, Employee>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'STAFF', 'MANAGER', 'ADMIN'),
      allowNull: false,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    last_login_at: DataTypes.DATE,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
    timestamps: true,
  }
);
