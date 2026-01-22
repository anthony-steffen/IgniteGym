import type { AssociationConfig } from './types';
import { User } from '../user.model';
import { Tenant } from '../tenant.model';
import { Employee } from '../employee.model';

/**
 * ============================
 * USER ↔ EMPLOYEE
 * Um usuário pode ser um funcionário
 * ============================
 */
export const employeeAssociations: AssociationConfig[] = [
  // 🔗 Um funcionário está associado a um usuário
  {
    source: Employee,
    type: 'belongsTo',
    target: User,
    options: { foreignKey: 'user_id', as: 'user' },
  },

  // 🔗 Um usuário pode ser um funcionário
  {
    source: User,
    type: 'hasOne',
    target: Employee,
    options: { foreignKey: 'user_id', as: 'employee_profile' },
  },
  
  // 🔗 Um funcionário está associado a uma academia
  {
    source: Employee,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },
];
