import { Subscription } from '../subscription.model';
import { Student } from '../student.model';
import { Plan } from '../plan.model';
import { Tenant } from '../tenant.model';
import { AssociationConfig } from './types';

export const subscriptionAssociations: AssociationConfig[] = [
  // Subscription → Student
  {
    source: Subscription,
    type: 'belongsTo',
    target: Student,
    options: { foreignKey: 'student_id', as: 'student' },
  },

  // Subscription → Plan
  {
    source: Subscription,
    type: 'belongsTo',
    target: Plan,
    options: { foreignKey: 'plan_id', as: 'plan' },
  },

  // Subscription → Tenant
  {
    source: Subscription,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },
];
