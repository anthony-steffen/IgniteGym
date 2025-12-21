import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  id: string;
  tenant_id: string;
  email: string;
  password_hash?: string | null;
  role: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
  name?: string | null;
  phone?: string | null;
  last_login_at?: Date | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'password_hash'
  | 'name'
  | 'phone'
  | 'last_login_at'
  | 'created_at'
  | 'updated_at'
>;

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public tenant_id!: string;
  public email!: string;
  public password_hash!: string | null;
  public role!: 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
  public name!: string | null;
  public phone!: string | null;
  public last_login_at!: Date | null;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

export default function initUserModel(sequelize: Sequelize) {
  UserModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('STUDENT', 'STAFF', 'MANAGER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'STUDENT',
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

  return UserModel;
}
