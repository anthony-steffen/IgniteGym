import { Sequelize, DataTypes, Model, Optional } from "sequelize";

export interface TenantAttributes {
  id: string;
  name: string;
  domain: string;
}

export interface TenantCreationAttributes
  extends Optional<TenantAttributes, "id"> {}

export class Tenant
  extends Model<TenantAttributes, TenantCreationAttributes>
  implements TenantAttributes
{
  declare id: string;
  declare name: string;
  declare domain: string;
}

export const initTenantModel = (sequelize: Sequelize) => {
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
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "tenants",
      underscored: true,
      timestamps: true,
    }
  );
};