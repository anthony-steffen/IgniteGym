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