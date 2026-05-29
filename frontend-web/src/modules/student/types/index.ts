// src/modules/student/types/index.ts
export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
}

export interface Student {
  birth_date: string;
  id: string;
  user_id: string;
  tenant_id: string;
  is_active: boolean;
  user: StudentUser; // Dados populados pelo include do Sequelize
}

export interface StudentSubscriptionHistory {
  id: string;
  status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
  payment_status?: 'PAID' | 'PENDING' | 'OVERDUE';
  start_date: string;
  end_date: string | null;
  price: number | string;
  plan?: {
    id: string;
    name: string;
  };
}

export interface StudentCheckinHistory {
  id: string;
  created_at: string;
}

export interface StudentSaleHistory {
  id: string;
  total_value: number | string;
  payment_method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
  created_at: string;
}

export interface StudentHistoryData {
  student: Student;
  summary: {
    totalSubscriptions: number;
    totalCheckins: number;
    totalSales: number;
    totalSpent: number;
    lastCheckinAt: string | null;
  };
  subscriptions: StudentSubscriptionHistory[];
  checkins: StudentCheckinHistory[];
  sales: StudentSaleHistory[];
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
}

export interface StudentStatsData {
  total: number;
  active: number;
  newThisMonth: number;
  pending: number;
}
