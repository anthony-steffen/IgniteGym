import { Tenant } from '../tenant.model';
import { User } from '../user.model';
import { Student } from '../student.model';
import { Plan } from '../plan.model';
import { Subscription } from '../subscription.model';
import { AssociationConfig } from './types';

export const tenantAssociations: AssociationConfig[] = [
  // Tenant → Users
  {
    source: Tenant,
    type: 'hasMany',
    target: User,
    options: { foreignKey: 'tenant_id', as: 'users' },
  },

  // Tenant → Students
  {
    source: Tenant,
    type: 'hasMany',
    target: Student,
    options: { foreignKey: 'tenant_id', as: 'students' },
  },

  // Tenant → Plans
  {
    source: Tenant,
    type: 'hasMany',
    target: Plan,
    options: { foreignKey: 'tenant_id', as: 'plans' },
  },

  // Tenant → Subscriptions
  {
    source: Tenant,
    type: 'hasMany',
    target: Subscription,
    options: { foreignKey: 'tenant_id', as: 'subscriptions' },
  },
];
