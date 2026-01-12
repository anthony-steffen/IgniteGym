export interface Supplier {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
}

export interface SupplierFormData {
  name: string;
  description: string;
  email: string;
  phone: string;
}