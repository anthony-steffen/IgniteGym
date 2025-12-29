import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association } from 'sequelize';
import { sequelize } from '../sequelize';
import { SaleItem } from './sale-item.model';

export class Sale extends Model<InferAttributes<Sale, { omit: 'items' }>, InferCreationAttributes<Sale, { omit: 'items' }>> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare student_id: string | null;
  declare employee_id: string;
  declare total_value: number;
  declare payment_method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

  declare items?: NonAttribute<SaleItem[]>;
  declare static associations: { items: Association<Sale, SaleItem>; };
}

Sale.init({
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  tenant_id: { type: DataTypes.UUID, allowNull: false },
  student_id: { type: DataTypes.UUID, allowNull: true },
  employee_id: { type: DataTypes.UUID, allowNull: false },
  total_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  payment_method: { type: DataTypes.ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX'), allowNull: false },
}, { sequelize, tableName: 'sales', underscored: true });