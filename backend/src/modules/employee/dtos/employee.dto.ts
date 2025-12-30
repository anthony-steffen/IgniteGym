export interface CreateEmployeeDTO {
  userId: string;
  tenantId: string;
  roleTitle: string;
}

export interface UpdateEmployeeDTO {
  roleTitle?: string;
  isActive?: boolean;
}