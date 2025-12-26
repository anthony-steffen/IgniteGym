
export interface UpdateStudentDTO {
  name: string;
  email?: string;
  phone?: string;
  birth_date?: Date;
  is_active?: boolean;
}