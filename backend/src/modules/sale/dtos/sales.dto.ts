export interface createSakeDTO {
  tenantId: string;
  studentId: string;
  employeeId: string;
  totalValue: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
}

export interface updateSaleDTO {
  tenantId: string;
  saleId: string;
  totalValue: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';
}

export interface listSalesDTO {
  tenantId: string;
}