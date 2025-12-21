// backend/src/modules/staff/dtos/UpdateStaffDTO.ts
export interface UpdateStaffDTO {
  name?: string;
  phone?: string;
  role?: "STAFF" | "MANAGER";
  is_active?: boolean;
}
