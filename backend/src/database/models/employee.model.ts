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

export class Employee extends Model<
  InferAttributes<Employee, { omit: 'user' }>,
  InferCreationAttributes<Employee, { omit: 'user' }>
> {
  declare id: CreationOptional<string>;
  declare user_id: string;
  declare role_title: string;
  declare is_active: boolean;


  // ✅ ASSOCIAÇÃO TIPADA
  declare user?: NonAttribute<User>;

  declare static associations: {
    user: Association<Employee, User>;
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
