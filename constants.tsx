
import React from 'react';
import { Service, ServiceCategory } from './types';
import { 
  Building2, 
  CreditCard, 
  Lightbulb, 
  Plane, 
  GraduationCap, 
  LayoutGrid,
  Landmark,
  ShieldCheck,
  FileText,
  UserCheck,
  Zap,
  Train
} from 'lucide-react';

export const SERVICES_DATA: Service[] = [
  // Government
  { name: 'CSC Digital Seva', url: 'https://digitalseva.csc.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['csc', 'digital seva'] },
  { name: 'Aadhar Update/Download', url: 'https://myaadhaar.uidai.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['uidai', 'aadhar', 'aadhaar'] },
  { name: 'PAN Card (NSDL)', url: 'https://www.onlineservices.nsdl.com', category: ServiceCategory.GOVERNMENT, tags: ['pan', 'nsdl'] },
  { name: 'PAN Card (UTI)', url: 'https://www.pan.utiitsl.com', category: ServiceCategory.GOVERNMENT, tags: ['pan', 'uti'] },
  { name: 'E-District UP', url: 'https://edistrict.up.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['up', 'edistrict', 'e-district'] },
  { name: 'PM Kisan Status', url: 'https://pmkisan.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['kisan', 'pm kisan'] },
  { name: 'E-Shram Card', url: 'https://eshram.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['shram', 'labour'] },
  { name: 'Vahan RC Status', url: 'https://vahan.parivahan.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['vahan', 'rc', 'bike', 'car'] },
  { name: 'Driving License', url: 'https://sarathi.parivahan.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['dl', 'driving license'] },
  { name: 'EPF / PF Portal', url: 'https://www.epfindia.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['epf', 'pf'] },
  { name: 'Ration Card Portal', url: 'https://nfsa.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['ration', 'khadya'] },
  { name: 'ITR Filing', url: 'https://incometax.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['itr', 'tax', 'income tax'] },
  { name: 'Passport Seva', url: 'https://www.passportindia.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['passport'] },
  { name: 'Voter ID (NVSP)', url: 'https://www.nvsp.in', category: ServiceCategory.GOVERNMENT, tags: ['voter', 'election'] },
  { name: 'PM Awas Yojana', url: 'https://www.pmawasyojana.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['awas', 'house'] },
  { name: 'National Scholarship', url: 'https://scholarships.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['scholarship'] },
  { name: 'MGNREGA Portal', url: 'https://nrega.nic.in', category: ServiceCategory.GOVERNMENT, tags: ['nrega', 'mgnrega'] },
  { name: 'UP Jansunwai', url: 'https://jansunwai.up.nic.in', category: ServiceCategory.GOVERNMENT, tags: ['complaint', 'jansunwai'] },
  { name: 'Property Registry UP', url: 'https://igrsup.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['registry', 'igrs'] },
  { name: 'Bhulekh (Land Record)', url: 'https://bhulekh.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['bhulekh', 'khasra', 'khatauni'] },

  // Banking
  { name: 'SBI Net Banking', url: 'https://www.onlinesbi.sbi', category: ServiceCategory.BANKING, tags: ['sbi', 'bank'] },
  { name: 'PNB Banking', url: 'https://www.pnbindia.in', category: ServiceCategory.BANKING, tags: ['pnb', 'bank'] },
  { name: 'Bank of Baroda', url: 'https://www.bankofbaroda.in', category: ServiceCategory.BANKING, tags: ['bob', 'bank'] },
  { name: 'IPPB Bank', url: 'https://www.ippbonline.com', category: ServiceCategory.BANKING, tags: ['ippb', 'post office'] },
  { name: 'HDFC Bank', url: 'https://www.hdfcbank.com', category: ServiceCategory.BANKING, tags: ['hdfc', 'bank'] },
  { name: 'ICICI Bank', url: 'https://www.icicibank.com', category: ServiceCategory.BANKING, tags: ['icici', 'bank'] },
  { name: 'Paytm Portal', url: 'https://paytm.com', category: ServiceCategory.BANKING, tags: ['paytm', 'wallet'] },
  { name: 'Spice Money', url: 'https://www.spicemoney.com', category: ServiceCategory.BANKING, tags: ['spice', 'aeps'] },
  { name: 'PayNearby', url: 'https://www.paynearby.in', category: ServiceCategory.BANKING, tags: ['paynearby', 'aeps'] },
  { name: 'Fino Bank', url: 'https://www.fino.co.in', category: ServiceCategory.BANKING, tags: ['fino', 'aeps'] },
  { name: 'Airtel Payment Bank', url: 'https://www.airtel.in/bank/', category: ServiceCategory.BANKING, tags: ['airtel', 'bank'] },
  { name: 'RBI Official', url: 'https://www.rbi.org.in', category: ServiceCategory.BANKING, tags: ['rbi'] },
  { name: 'Free CIBIL Score', url: 'https://www.cibil.com', category: ServiceCategory.BANKING, tags: ['cibil', 'credit'] },

  // Bills
  { name: 'UPPCL Rural Bill', url: 'https://uppcl.mpower.in', category: ServiceCategory.UTILITY, tags: ['light', 'electricity', 'uppcl', 'bijli'] },
  { name: 'UPPCL Urban Bill', url: 'https://www.uppclonline.com', category: ServiceCategory.UTILITY, tags: ['light', 'electricity', 'uppcl', 'bijli'] },
  { name: 'Bharat Gas', url: 'https://my.ebharatgas.com', category: ServiceCategory.UTILITY, tags: ['gas', 'bharat'] },
  { name: 'Indane Gas', url: 'https://indane.co.in', category: ServiceCategory.UTILITY, tags: ['gas', 'indane'] },
  { name: 'HP Gas', url: 'https://www.hpgas.com', category: ServiceCategory.UTILITY, tags: ['gas', 'hp'] },
  { name: 'LIC Premium', url: 'https://www.licindia.in', category: ServiceCategory.UTILITY, tags: ['lic', 'insurance'] },
  { name: 'FASTag Recharge', url: 'https://www.fastag.org', category: ServiceCategory.UTILITY, tags: ['fastag', 'toll'] },
  { name: 'Jio Recharge', url: 'https://www.jio.com', category: ServiceCategory.UTILITY, tags: ['jio', 'recharge'] },
  { name: 'VI Recharge', url: 'https://www.vi.in', category: ServiceCategory.UTILITY, tags: ['vi', 'recharge'] },
  { name: 'Airtel Recharge', url: 'https://www.airtel.in', category: ServiceCategory.UTILITY, tags: ['airtel', 'recharge'] },
  { name: 'DTH Recharge', url: 'https://www.dishanywhere.com', category: ServiceCategory.UTILITY, tags: ['dth', 'dish', 'tv'] },

  // Travel
  { name: 'IRCTC Ticket', url: 'https://www.irctc.co.in', category: ServiceCategory.TRAVEL, tags: ['train', 'irctc', 'railway'] },
  { name: 'UP Roadways Bus', url: 'https://www.upsrtc.com', category: ServiceCategory.TRAVEL, tags: ['bus', 'upsrtc', 'up'] },
  { name: 'MakeMyTrip', url: 'https://www.makemytrip.com', category: ServiceCategory.TRAVEL, tags: ['flight', 'hotel', 'travel'] },
  { name: 'RedBus Booking', url: 'https://www.redbus.in', category: ServiceCategory.TRAVEL, tags: ['bus', 'redbus'] },
  { name: 'Flight Booking', url: 'https://www.indigo.in', category: ServiceCategory.TRAVEL, tags: ['flight', 'indigo'] },
  { name: 'Train PNR Status', url: 'https://www.confirmtkt.com', category: ServiceCategory.TRAVEL, tags: ['pnr', 'train'] },

  // Education
  { name: 'Sarkari Result', url: 'https://www.sarkariresult.com', category: ServiceCategory.EDUCATION, tags: ['jobs', 'sarkari result'] },
  { name: 'Free Job Alert', url: 'https://www.freejobalert.com', category: ServiceCategory.EDUCATION, tags: ['jobs', 'alert'] },
  { name: 'UPSC Portal', url: 'https://upsc.gov.in', category: ServiceCategory.EDUCATION, tags: ['upsc', 'exams'] },
  { name: 'SSC Portal', url: 'https://ssc.nic.in', category: ServiceCategory.EDUCATION, tags: ['ssc', 'exams'] },
  { name: 'UP Board (UPMSP)', url: 'https://upmsp.edu.in', category: ServiceCategory.EDUCATION, tags: ['upmsp', 'up board', 'result'] },
  { name: 'CBSE Portal', url: 'https://www.cbse.gov.in', category: ServiceCategory.EDUCATION, tags: ['cbse', 'result'] },
  { name: 'IGNOU Portal', url: 'https://www.ignou.ac.in', category: ServiceCategory.EDUCATION, tags: ['ignou', 'university'] },
  { name: 'UP Scholarship', url: 'https://scholarship.up.gov.in', category: ServiceCategory.EDUCATION, tags: ['scholarship', 'up'] },
  { name: 'DigiLocker', url: 'https://digilocker.gov.in', category: ServiceCategory.EDUCATION, tags: ['digilocker', 'docs'] },

  // Misc
  { name: 'Amazon', url: 'https://www.amazon.in', category: ServiceCategory.MISC, tags: ['shopping', 'amazon'] },
  { name: 'Flipkart', url: 'https://www.flipkart.com', category: ServiceCategory.MISC, tags: ['shopping', 'flipkart'] },
  { name: 'WhatsApp Web', url: 'https://web.whatsapp.com', category: ServiceCategory.MISC, tags: ['whatsapp', 'chat'] },
  { name: 'Canva (Design)', url: 'https://www.canva.com', category: ServiceCategory.MISC, tags: ['design', 'canva'] },
  { name: 'TAN Application', url: 'https://tin.tin.nsdl.com', category: ServiceCategory.MISC, tags: ['tan'] },
  { name: 'GST Portal', url: 'https://www.gst.gov.in', category: ServiceCategory.MISC, tags: ['gst', 'tax'] },
  { name: 'ICEGATE', url: 'https://icegate.gov.in', category: ServiceCategory.MISC, tags: ['customs', 'icegate'] },
  { name: 'MCA Services', url: 'https://www.mca.gov.in', category: ServiceCategory.MISC, tags: ['mca', 'company'] },
  { name: 'MSME / Udyam', url: 'https://www.udyamregistration.gov.in', category: ServiceCategory.MISC, tags: ['msme', 'udyam'] },
  { name: 'Marriage Registration', url: 'https://www.shadi.com', category: ServiceCategory.MISC, tags: ['marriage', 'shadi'] },
  { name: 'Birth/Death Cert', url: 'https://crsorgi.gov.in', category: ServiceCategory.MISC, tags: ['birth', 'death', 'certificate'] },
  { name: 'CoWIN Vaccine', url: 'https://www.cowin.gov.in', category: ServiceCategory.MISC, tags: ['vaccine', 'cowin'] },
  { name: 'National Career Service', url: 'https://www.ncs.gov.in', category: ServiceCategory.MISC, tags: ['ncs', 'jobs'] },
  { name: 'E-Tenders', url: 'https://www.gepnic.gov.in', category: ServiceCategory.MISC, tags: ['tender', 'gepnic'] },
  { name: 'Central Procurement', url: 'https://eprocure.gov.in', category: ServiceCategory.MISC, tags: ['procurement', 'eprocure'] },
];

export const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  [ServiceCategory.GOVERNMENT]: <Building2 className="w-6 h-6" />,
  [ServiceCategory.BANKING]: <Landmark className="w-6 h-6" />,
  [ServiceCategory.UTILITY]: <Zap className="w-6 h-6" />,
  [ServiceCategory.TRAVEL]: <Train className="w-6 h-6" />,
  [ServiceCategory.EDUCATION]: <GraduationCap className="w-6 h-6" />,
  [ServiceCategory.MISC]: <LayoutGrid className="w-6 h-6" />,
};
