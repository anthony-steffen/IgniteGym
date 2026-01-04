export interface Plan {
  id: string;
  name: string;
  duration_days: number; // Padronizado conforme seu erro de TS
  price: number;
  created_at?: string;
}