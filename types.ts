
export enum ServiceCategory {
  GOVERNMENT = 'मुख्य सरकारी सेवाएँ (Government)',
  BANKING = 'बैंकिंग और वॉलेट (Banking)',
  UTILITY = 'बिल और यूटिलिटी (Utility)',
  TRAVEL = 'यात्रा और बुकिंग (Travel)',
  EDUCATION = 'शिक्षा और नौकरी (Education)',
  MISC = 'अन्य महत्वपूर्ण (Others)'
}

export interface Service {
  id: string;
  name: string;
  url: string;
  category: ServiceCategory;
  tags: string[];
  fee: number;
  featured?: boolean;
}

export interface Transaction {
  id: string;
  serviceName: string;
  amount: number;
  type: 'debit' | 'credit';
  date: string;
  status: 'success' | 'failed' | 'pending';
  prevBalance: number;
  newBalance: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  walletBalance: number;
  transactions: Transaction[];
  isAdmin?: boolean;
}
