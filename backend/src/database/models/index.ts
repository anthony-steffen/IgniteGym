import { sequelize } from "../sequelize";
import {User} from "./user.model";
import { Tenant } from "./tenant.model";
import { Employee } from "./employee.model";

export const models = {
  User,
  Tenant,
  Employee,
};

export async function initModels() {
  Object.values(models).forEach(model => {
    if ((model as any).associate) {
      (model as any).associate(models);
    }
  });
}
