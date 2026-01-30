
export interface Transaction {
  id: string;
  serviceName: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
  status: 'success' | 'pending' | 'failed';
  prevBalance: number;
  newBalance: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  mobile?: string;
  address?: string;
  walletBalance: number;
  walletPin?: string; // New field for security
  isAdmin: boolean;
  createdAt: string;
}
