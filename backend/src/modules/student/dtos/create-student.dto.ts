export interface CreateStudentDTO {
  name: string;
  email: string;
  phone?: string;
  birth_date: Date;
}