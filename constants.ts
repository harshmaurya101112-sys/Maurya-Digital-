
import { Service, ServiceCategory } from './types';

export const SERVICES_DATA: Service[] = [
  // Government
  { id: 'csc', name: 'CSC Digital Seva', url: 'https://digitalseva.csc.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['csc', 'digital seva'], fee: 0, featured: true },
  { id: 'aadhar', name: 'Aadhar Update/Download', url: 'https://myaadhaar.uidai.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['uidai', 'aadhar', 'aadhaar'], fee: 75, featured: true },
  { id: 'pan_nsdl', name: 'PAN Card (NSDL)', url: 'https://www.onlineservices.nsdl.com', category: ServiceCategory.GOVERNMENT, tags: ['pan', 'nsdl'], fee: 107, featured: true },
  { id: 'pan_uti', name: 'PAN Card (UTI)', url: 'https://www.pan.utiitsl.com', category: ServiceCategory.GOVERNMENT, tags: ['pan', 'uti'], fee: 107 },
  { id: 'edistrict_up', name: 'E-District UP', url: 'https://edistrict.up.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['up', 'edistrict'], fee: 30, featured: true },
  { id: 'pmkisan', name: 'PM Kisan Status', url: 'https://pmkisan.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['kisan'], fee: 10 },
  { id: 'eshram', name: 'E-Shram Card', url: 'https://eshram.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['shram'], fee: 50 },
  { id: 'vahan', name: 'Vahan RC Status', url: 'https://vahan.parivahan.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['vahan', 'rc'], fee: 20 },
  { id: 'dl', name: 'Driving License', url: 'https://sarathi.parivahan.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['dl'], fee: 100 },
  { id: 'epf', name: 'EPF / PF Portal', url: 'https://www.epfindia.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['epf', 'pf'], fee: 50 },
  { id: 'ration', name: 'Ration Card Portal', url: 'https://nfsa.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['ration'], fee: 25 },
  { id: 'itr', name: 'ITR Filing', url: 'https://incometax.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['itr'], fee: 200 },
  { id: 'passport', name: 'Passport Seva', url: 'https://www.passportindia.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['passport'], fee: 150 },
  { id: 'voter', name: 'Voter ID (NVSP)', url: 'https://www.nvsp.in', category: ServiceCategory.GOVERNMENT, tags: ['voter'], fee: 50 },
  
  // Banking
  { id: 'sbi', name: 'SBI Net Banking', url: 'https://www.onlinesbi.sbi', category: ServiceCategory.BANKING, tags: ['sbi', 'bank'], fee: 0, featured: true },
  { id: 'pnb', name: 'PNB Banking', url: 'https://www.pnbindia.in', category: ServiceCategory.BANKING, tags: ['pnb', 'bank'], fee: 0 },
  { id: 'bob', name: 'Bank of Baroda', url: 'https://www.bankofbaroda.in', category: ServiceCategory.BANKING, tags: ['bob', 'bank'], fee: 0 },
  { id: 'ippb', name: 'IPPB Bank', url: 'https://www.ippbonline.com', category: ServiceCategory.BANKING, tags: ['ippb', 'post office'], fee: 0 },
  { id: 'spicemoney', name: 'Spice Money', url: 'https://www.spicemoney.com', category: ServiceCategory.BANKING, tags: ['spice', 'aeps'], fee: 0, featured: true },
  { id: 'cibil', name: 'Free CIBIL Score', url: 'https://www.cibil.com', category: ServiceCategory.BANKING, tags: ['cibil'], fee: 50 },

  // Utility
  { id: 'uppcl_rural', name: 'UPPCL Rural Bill', url: 'https://uppcl.mpower.in', category: ServiceCategory.UTILITY, tags: ['electricity', 'uppcl'], fee: 10 },
  { id: 'uppcl_urban', name: 'UPPCL Urban Bill', url: 'https://www.uppclonline.com', category: ServiceCategory.UTILITY, tags: ['electricity', 'uppcl'], fee: 10 },
  { id: 'gas_bharat', name: 'Bharat Gas', url: 'https://my.ebharatgas.com', category: ServiceCategory.UTILITY, tags: ['gas'], fee: 15 },
  { id: 'lic', name: 'LIC Premium', url: 'https://www.licindia.in', category: ServiceCategory.UTILITY, tags: ['lic', 'insurance'], fee: 10 },
  { id: 'fastag', name: 'FASTag Recharge', url: 'https://www.fastag.org', category: ServiceCategory.UTILITY, tags: ['fastag'], fee: 5 },

  // Travel
  { id: 'irctc', name: 'IRCTC Ticket', url: 'https://www.irctc.co.in', category: ServiceCategory.TRAVEL, tags: ['train', 'irctc'], fee: 40 },
  { id: 'upsrtc', name: 'UP Roadways Bus', url: 'https://www.upsrtc.com', category: ServiceCategory.TRAVEL, tags: ['bus', 'upsrtc'], fee: 20 },
  { id: 'redbus', name: 'RedBus Booking', url: 'https://www.redbus.in', category: ServiceCategory.TRAVEL, tags: ['bus', 'redbus'], fee: 20 },

  // Education
  { id: 'sarkari_result', name: 'Sarkari Result', url: 'https://www.sarkariresult.com', category: ServiceCategory.EDUCATION, tags: ['jobs'], fee: 0 },
  { id: 'digilocker', name: 'DigiLocker', url: 'https://digilocker.gov.in', category: ServiceCategory.EDUCATION, tags: ['docs'], fee: 0 },
  { id: 'upscholarship', name: 'UP Scholarship', url: 'https://scholarship.up.gov.in', category: ServiceCategory.EDUCATION, tags: ['scholarship'], fee: 50 },
];
