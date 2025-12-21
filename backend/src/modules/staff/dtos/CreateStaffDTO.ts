// backend/src/modules/staff/dtos/CreateStaffDTO.ts
export interface CreateStaffDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "STAFF" | "MANAGER";
}
