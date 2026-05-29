import type { Plan } from '../../plan/types';
import type { StudentUser } from '../../student/types';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';

export interface Subscription {
  id: string;
  student_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  price: number | string;
  student?: {
    id: string;
    user?: StudentUser;
  };
  plan?: Plan;
}

export interface CreateSubscriptionPayload {
  studentId: string;
  planId: string;
}
