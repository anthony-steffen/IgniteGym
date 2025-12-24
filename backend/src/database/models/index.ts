import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { Tenant } from './tenant.model';
import { Employee } from './employee.model';

export function initModels(sequelize: Sequelize) {
  // 🔗 TENANT → USERS
  Tenant.hasMany(User, {
    foreignKey: 'tenant_id',
    as: 'users',
  });

  User.belongsTo(Tenant, {
    foreignKey: 'tenant_id',
    as: 'tenant',
  });

  // 🔗 USER → EMPLOYEE
  User.hasOne(Employee, {
    foreignKey: 'user_id',
    as: 'employee',
  });

  Employee.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });
}

// export opcional para uso externo (tests, seeds, etc)
export { User, Tenant, Employee };
