/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Employee {
  is_active: any;
  id: string;
  roleTitle: string;
  salary: number;
  weeklyHours: number;
  workSchedule: any;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateEmployeePayload {
  roleTitle: string;
  salary: number;
  weeklyHours: number;
  workSchedule: any;
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