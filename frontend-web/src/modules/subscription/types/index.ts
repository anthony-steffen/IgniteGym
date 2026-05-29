import type { Plan } from '../../plan/types';
import type { StudentUser } from '../../student/types';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface Subscription {
  id: string;
  student_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  payment_status: PaymentStatus;
  start_date: string;
  end_date: string | null;
  next_due_date: string | null;
  last_payment_at: string | null;
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
  paymentStatus?: PaymentStatus;
}
