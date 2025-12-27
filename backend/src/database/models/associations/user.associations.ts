import { User } from '../user.model';
import { Tenant } from '../tenant.model';
import { Employee } from '../employee.model';
import { Student } from '../student.model';
import { AssociationConfig } from './types';

export const userAssociations: AssociationConfig[] = [
  // User → Tenant
  {
    source: User,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },

  // User → Employee
  {
    source: User,
    type: 'hasOne',
    target: Employee,
    options: { foreignKey: 'user_id', as: 'employee' },
  },

  // User → Student
  {
    source: User,
    type: 'hasOne',
    target: Student,
    options: { foreignKey: 'user_id', as: 'student' },
  },
];
