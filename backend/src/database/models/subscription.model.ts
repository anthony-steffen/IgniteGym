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
import { Student } from './student.model';
import { Plan } from './plan.model';

export class Subscription extends Model<
  InferAttributes<Subscription, { omit: 'student' | 'plan' }>,
  InferCreationAttributes<Subscription, { omit: 'student' | 'plan' }>
> {
  declare id: CreationOptional<string>;
  declare tenant_id: string;

  declare student_id: string;
  declare plan_id: string;

  declare status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  declare start_date: Date;
  declare end_date: Date | null;
  declare price: number;

  // 🔗 Associações tipadas
  declare student?: NonAttribute<Student>;
  declare plan?: NonAttribute<Plan>;

  declare static associations: {
    student: Association<Subscription, Student>;
    plan: Association<Subscription, Plan>;
  };
}

Subscription.init(
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

    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('ACTIVE', 'CANCELED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'subscriptions',
    underscored: true,
    timestamps: true,
  }
);
