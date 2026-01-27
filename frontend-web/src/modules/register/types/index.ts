export interface RegisterTenantData {
  // Dados da Unidade
  name: string;
  slug: string;
  contact_email: string;
  address?: string;

  // Dados do Admin
  admin_name: string;
  admin_email: string;
  admin_password: string;
}

export interface RegisterResponse {
  tenant: {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}