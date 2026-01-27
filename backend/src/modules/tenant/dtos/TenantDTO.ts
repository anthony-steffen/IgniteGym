export interface CreateTenantDTO {
  // Dados da Unidade (Tenant)
  name: string;
  slug: string;
  address?: string;
  contact_email?: string;

  // Dados do Administrador (User)
  admin_name: string;
  admin_email: string;
  admin_password: string;
}