import type { AssociationConfig } from './types';
import { User } from '../user.model';
import { Employee } from '../employee.model';

/**
 * ============================
 * USER ↔ EMPLOYEE
 * Um usuário pode ser um funcionário
 * ============================
 */
export const employeeAssociations: AssociationConfig[] = [
  {
    source: User,
    type: 'hasOne',
    target: Employee,
    options: {
      foreignKey: 'user_id',
      as: 'employee',
    },
  },
  {
    source: Employee,
    type: 'belongsTo',
    target: User,
    options: {
      foreignKey: 'user_id',
      as: 'user',
    },
  },
];
