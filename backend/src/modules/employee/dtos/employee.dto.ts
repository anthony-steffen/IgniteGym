export interface CreateEmployeeDTO {
  name: any;
  email: any;
  password: any;
  userId: string;
  tenantId: string;
  roleTitle: string;
  salary: number;
  weeklyHours: number;
  workSchedule: string;
}

export interface UpdateEmployeeDTO {
  roleTitle?: string;
  isActive?: boolean;
  salary?: number;
  weeklyHours?: number;
  workSchedule?: string;
}