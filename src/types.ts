export type TransactionType = 'Utang' | 'Payment';
export type TransactionStatus = 'Unpaid' | 'Paid';

export interface Transaction {
  id: string;
  date: string; // MM/DD/YYYY
  customer: string;
  customerId: string;
  type: TransactionType;
  description: string;
  amount: number;
  balance: number;
  status: TransactionStatus;
  notes?: string;
  items?: { name: string; qty: number; price: number }[];
  time?: string;
}

export interface Customer {
  id: string;
  name: string;
  contactNumber: string;
  outstandingBalance: number;
  creditLimit?: number;
  address?: string;
  joinedDate?: string;
}

export interface FilterState {
  search: string;
  date: string;
  type: string;
  customer: string;
}
