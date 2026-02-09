// src/modules/plan/types/index.ts  
export interface Plan {
  id: string;
  name: string;
  duration_days: number; // Padronizado conforme seu erro de TS
  price: number;
  created_at?: string;
}

export interface PlanFormData {
  name: string;
  duration_days: number;
  price: number;
}