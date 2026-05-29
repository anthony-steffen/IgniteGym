export type WorkSchedule = Record<string, string>;

export interface Employee {
  id: string;
  roleTitle: string;
  salary: number;
  weeklyHours: number;
  workSchedule: WorkSchedule;
  is_active?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    is_active?: boolean;
  };
}

export interface CreateEmployeePayload {
  roleTitle: string;
  salary: number;
  weeklyHours: number;
  workSchedule: WorkSchedule;
  userId?: string;
  name?: string;
  email?: string;
  password?: string;
}

// Interface auxiliar para o Modal e Hook
export interface CreateEmployeeData {
  userId: string;
  roleTitle: string;
}

export interface EligibleUser {
  id: string;
  name: string;
  email: string;
}
