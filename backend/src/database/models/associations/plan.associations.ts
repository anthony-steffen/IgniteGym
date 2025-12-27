import { Plan } from '../plan.model';
import { Tenant } from '../tenant.model';
import { Subscription } from '../subscription.model';
import { AssociationConfig } from './types';

export const planAssociations: AssociationConfig[] = [
  // Plan → Tenant
  {
    source: Plan,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },

  // Plan → Subscriptions
  {
    source: Plan,
    type: 'hasMany',
    target: Subscription,
    options: { foreignKey: 'plan_id', as: 'subscriptions' },
  },
];
