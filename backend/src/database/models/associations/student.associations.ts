import { Student } from '../student.model';
import { User } from '../user.model';
import { Tenant } from '../tenant.model';
import { Subscription } from '../subscription.model';
import { AssociationConfig } from './types';

export const studentAssociations: AssociationConfig[] = [
  // Student → User
  {
    source: Student,
    type: 'belongsTo',
    target: User,
    options: { foreignKey: 'user_id', as: 'user' },
  },

  // Student → Tenant
  {
    source: Student,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },

  // Student → Subscriptions
  {
    source: Student,
    type: 'hasMany',
    target: Subscription,
    options: { foreignKey: 'student_id', as: 'subscriptions' },
  },
];
