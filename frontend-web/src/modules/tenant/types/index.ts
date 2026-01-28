export interface Tenant {
  id: string;
  name: string;
  slug: string;
  contact_email: string | null;
  address: string | null;
  timezone: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUnitFormData {
  name: string;
  slug: string;
  contact_email?: string;
  address?: string;
}