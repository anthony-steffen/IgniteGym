export interface CreateStudentDTO {
  slug: string;
  name: string;
  email: string;
  phone?: string;
  birth_date: Date;
}