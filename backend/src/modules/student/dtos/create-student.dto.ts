export interface CreateStudentDTO {
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  birth_date: Date;
}