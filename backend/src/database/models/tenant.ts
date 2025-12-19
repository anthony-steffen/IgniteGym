import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TenantAttributes {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

type TenantCreationAttributes = Optional<
  TenantAttributes,
  "id" | "is_active" | "created_at" | "updated_at"
>;

module.exports = (sequelize: Sequelize) => {
  const Tenant = sequelize.define<
    Model<TenantAttributes, TenantCreationAttributes>
  >(
    "Tenant",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "tenants",
      underscored: true,
      timestamps: true,
    }
  );

  (Tenant as any).associate = (models: any) => {
    Tenant.hasMany(models.User, {
      foreignKey: "tenant_id",
      as: "users",
    });
  };

  return Tenant;
};
