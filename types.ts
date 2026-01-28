
export enum ServiceCategory {
  GOVERNMENT = 'मुख्य सरकारी सेवाएँ (Government)',
  BANKING = 'बैंकिंग और वॉलेट (Banking)',
  UTILITY = 'बिल और यूटिलिटी (Utility)',
  TRAVEL = 'यात्रा और बुकिंग (Travel)',
  EDUCATION = 'शिक्षा और नौकरी (Education)',
  MISC = 'अन्य महत्वपूर्ण (Others)'
}

export interface Service {
  name: string;
  url: string;
  category: ServiceCategory;
  tags: string[];
}
