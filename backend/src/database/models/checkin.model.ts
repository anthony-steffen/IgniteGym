import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../sequelize';

export class CheckIn extends Model<
  InferAttributes<CheckIn>,
  InferCreationAttributes<CheckIn>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;
  declare student_id: string;
  declare subscription_id: string;
  declare checked_in_at: CreationOptional<Date>;
}

CheckIn.init(
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
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subscription_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    checked_in_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'checkins',
    underscored: true,
    timestamps: true,
  }
);
