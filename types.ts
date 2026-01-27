
export type CategoryCode = 'G2C' | 'Bank' | 'Edu' | 'Util';

export interface Service {
  name: string;
  cat: CategoryCode;
  url: string;
  iconName: string;
}

export interface Category {
  code: CategoryCode;
  title: string;
  description: string;
}
