export interface CreateSubscriptionDTO {
  tenantId: string;
  studentId: string;
  planId: string;
  paymentStatus?: 'PAID' | 'PENDING' | 'OVERDUE';
}
