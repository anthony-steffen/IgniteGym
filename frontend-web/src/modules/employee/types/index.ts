export interface Employee {
  id: string;
  user_id: string;
  tenant_id: string;
  role_title: string;
  is_active: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
}

export interface CreateEmployeeData {
  userId: string;
  roleTitle: string;
}