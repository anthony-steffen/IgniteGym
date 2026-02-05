export interface User {
  id: string;
  name: string;
  email: string;
  tenant_id: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF' | 'STUDENT';
}

export interface AuthResponse {
  slug: string;
  token: string;
  user: User;
}

// DTO para o registro via StudentService
export interface CreateStudentDTO {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birth_date?: string;
  tenantId: string;
}