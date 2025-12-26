// src/database/models/student.model.ts
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

export class Student extends Model<
  InferAttributes<Student, { omit: 'user' | 'tenant' }>,
  InferCreationAttributes<Student, { omit: 'user' | 'tenant' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare user_id: string;
  declare birth_date: Date | null;
  declare is_active: CreationOptional<boolean>;

    // 🔗 ASSOCIAÇÃO TIPADA
  declare user?: NonAttribute<User>;
  declare tenant?: NonAttribute<Tenant>;

  declare static associations: {
    user: Association<Student, User>;
    tenant: Association<Student, Tenant>;
  };
}

Student.init(
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'students',
    underscored: true,
    timestamps: true,
  }
);
