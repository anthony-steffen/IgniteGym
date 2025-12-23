import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TenantAttributes {
  id: string;
  name: string;
  slug: string;
  contact_email?: string | null;
  address?: string | null;
  timezone: string;
  is_active: boolean;
}

export type TenantCreationAttributes =
  Optional<TenantAttributes, 'id' | 'contact_email' | 'address' | 'is_active'>;

export class Tenant
  extends Model<TenantAttributes, TenantCreationAttributes>
  implements TenantAttributes
{
  declare id: string;
  declare name: string;
  declare slug: string;
  declare contact_email: string | null;
  declare address: string | null;
  declare timezone: string;
  declare is_active: boolean;
}

export function initTenantModel(sequelize: Sequelize) {
  Tenant.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      contact_email: DataTypes.STRING,
      address: DataTypes.STRING,
      timezone: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'tenants',
      underscored: true,
      timestamps: true,
    }
  );
}
