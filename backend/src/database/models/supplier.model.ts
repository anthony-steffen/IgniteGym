import { 
  Model, DataTypes, InferAttributes, InferCreationAttributes, 
  CreationOptional, NonAttribute 
} from 'sequelize';
import { sequelize } from '../sequelize';
import { Tenant } from './tenant.model';

export class Supplier extends Model<
  InferAttributes<Supplier, { omit: 'tenant' }>, 
  InferCreationAttributes<Supplier, { omit: 'tenant' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare name: string;
  declare description: string | null;
  declare email: string | null;
  declare phone: string | null;
  declare is_active: CreationOptional<boolean>;

  // 🔗 Associação tipada
  declare tenant?: NonAttribute<Tenant>;
}

Supplier.init({
  id: { 
    type: DataTypes.UUID, 
    primaryKey: true, 
    defaultValue: DataTypes.UUIDV4 
  },
  tenant_id: { 
    type: DataTypes.UUID, 
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: true,
    validate: { isEmail: true }
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
}, {
  sequelize,
  tableName: 'suppliers',
  underscored: true,
  timestamps: true,
});