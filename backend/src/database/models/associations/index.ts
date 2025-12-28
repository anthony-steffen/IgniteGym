import { tenantAssociations } from './tenant.associations';
import { userAssociations } from './user.associations';
import { studentAssociations } from './student.associations';
import { planAssociations } from './plan.associations';
import { subscriptionAssociations } from './subscription.associations';
import { checkinAssociations } from './checkin.assiciations';

import { AssociationConfig } from './types';

export const associations: AssociationConfig[] = [
  ...tenantAssociations,
  ...userAssociations,
  ...studentAssociations,
  ...planAssociations,
  ...subscriptionAssociations,
  ...checkinAssociations,
];

export function setupAssociations() {
  associations.forEach(({ source, type, target, options }) => {
    source[type](target, options);
  });
}
