import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface associatedModels {
  Tenant: Model<any, any>;
}

interface UserAttributes {
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

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'password_hash' | 'name' | 'phone' | 'last_login_at' | 'created_at' | 'updated_at'>;

module.exports = (sequelize: Sequelize) => {
  const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>('User', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: false
  });

  (User as any).associate = (models: any) => {
    User.belongsTo(models.Tenant, {
      foreignKey: 'tenant_id',
      as: 'tenant',
    });
  };

  return User;
};
