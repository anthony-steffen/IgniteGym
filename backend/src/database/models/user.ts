import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { sequelize } from "../sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: string;
  declare tenant_id: string;
  declare email: string;
  declare password_hash: string;
  declare role: "STUDENT" | "STAFF" | "MANAGER" | "ADMIN";
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("STUDENT", "STAFF", "MANAGER", "ADMIN"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    underscored: true,
    timestamps: true,
  }
);
