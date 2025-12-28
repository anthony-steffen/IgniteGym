// checkin.associations.ts
import type { AssociationConfig } from './types';
import { Tenant } from '../tenant.model';
import { Student } from '../student.model';
import { Subscription } from '../subscription.model';
import { CheckIn } from '../checkin.model';

export const checkinAssociations: AssociationConfig[] = [

  /**
   * ============================
   * TENANT ↔ CHECK-INS
   * Um tenant possui vários check-ins
   * ============================
   */
  {
    source: Tenant,
    type: 'hasMany',
    target: CheckIn,
    options: { foreignKey: 'tenant_id', as: 'checkins' },
  },
  {
    source: CheckIn,
    type: 'belongsTo',
    target: Tenant,
    options: { foreignKey: 'tenant_id', as: 'tenant' },
  },

  /**
   * ============================
   * STUDENT ↔ CHECK-INS
   * Um aluno possui vários check-ins
   * ============================
   */
  {
    source: Student,
    type: 'hasMany',
    target: CheckIn,
    options: { foreignKey: 'student_id', as: 'checkins' },
  },
  {
    source: CheckIn,
    type: 'belongsTo',
    target: Student,
    options: { foreignKey: 'student_id', as: 'student' },
  },

  /**
   * ============================
   * SUBSCRIPTION ↔ CHECK-INS
   * Uma assinatura possui vários check-ins
   * ============================
   */

  {
    source: Subscription,
    type: 'hasMany',
    target: CheckIn,
    options: { foreignKey: 'subscription_id', as: 'checkins' },
  },
  {
    source: CheckIn,
    type: 'belongsTo',
    target: Subscription,
    options: { foreignKey: 'subscription_id', as: 'subscription' },
  },
];
