
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

export interface ServiceCredential {
  id: string;
  pass: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  mobile?: string;
  address?: string;
  walletBalance: number;
  walletPin?: string;
  isAdmin: boolean;
  createdAt: string;
  // New: Store credentials for different services (e.g., 'up_edistrict': {id: '...', pass: '...'})
  serviceCredentials?: Record<string, ServiceCredential>;
}
