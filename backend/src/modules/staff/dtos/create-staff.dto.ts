// backend/src/modules/staff/dtos/CreateStaffDTO.ts
export interface CreateStaffDTO {
  tenantId: string;

  email: string;
  password: string;

  name?: string;
  phone?: string;

  roleTitle: string;
}
