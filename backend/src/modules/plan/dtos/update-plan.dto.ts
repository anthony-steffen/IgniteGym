export interface UpdatePlanDTO {
  tenantId: string;
  planId: string;
  name?: string;
  price?: number;
  duration_days?: number;
  is_active?: boolean;
}
