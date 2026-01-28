
import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  CreditCard, 
  Lightbulb, 
  Plane, 
  GraduationCap, 
  LayoutGrid,
  Landmark,
  ShieldCheck,
  Zap,
  Train,
  Search,
  Monitor,
  User,
  ExternalLink,
  ArrowRight,
  Info,
  Bell,
  Heart,
  Grid3X3,
  Globe
} from 'lucide-react';

// --- TYPES & INTERFACES ---

enum ServiceCategory {
  GOVERNMENT = 'मुख्य सरकारी सेवाएँ (Government)',
  BANKING = 'बैंकिंग और वॉलेट (Banking)',
  UTILITY = 'बिल और यूटिलिटी (Utility)',
  TRAVEL = 'यात्रा और बुकिंग (Travel)',
  EDUCATION = 'शिक्षा और नौकरी (Education)',
  MISC = 'अन्य महत्वपूर्ण (Others)'
}

interface Service {
  name: string;
  url: string;
  category: ServiceCategory;
  tags: string[];
}

// --- DATA ---

const SERVICES_DATA: Service[] = [
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
  { name: 'Bhulekh (Land Record)', url: 'https://bhulekh.gov.in', category: ServiceCategory.GOVERNMENT, tags: ['bhulekh', 'khasra', 'khatauni'] },
  { name: 'SBI Net Banking', url: 'https://www.onlinesbi.sbi', category: ServiceCategory.BANKING, tags: ['sbi', 'bank'] },
  { name: 'UPPCL Rural Bill', url: 'https://uppcl.mpower.in', category: ServiceCategory.UTILITY, tags: ['light', 'electricity', 'uppcl', 'bijli'] },
  { name: 'IRCTC Ticket', url: 'https://www.irctc.co.in', category: ServiceCategory.TRAVEL, tags: ['train', 'irctc', 'railway'] },
  { name: 'Sarkari Result', url: 'https://www.sarkariresult.com', category: ServiceCategory.EDUCATION, tags: ['jobs', 'sarkari result'] },
  { name: 'DigiLocker', url: 'https://digilocker.gov.in', category: ServiceCategory.EDUCATION, tags: ['digilocker', 'docs'] },
  { name: 'GST Portal', url: 'https://www.gst.gov.in', category: ServiceCategory.MISC, tags: ['gst', 'tax'] },
];

const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  [ServiceCategory.GOVERNMENT]: <Building2 className="w-5 h-5" />,
  [ServiceCategory.BANKING]: <Landmark className="w-5 h-5" />,
  [ServiceCategory.UTILITY]: <Zap className="w-5 h-5" />,
  [ServiceCategory.TRAVEL]: <Train className="w-5 h-5" />,
  [ServiceCategory.EDUCATION]: <GraduationCap className="w-5 h-5" />,
  [ServiceCategory.MISC]: <LayoutGrid className="w-5 h-5" />,
};

// --- COMPONENTS ---

const Header: React.FC<{ searchTerm: string; setSearchTerm: (v: string) => void }> = ({ searchTerm, setSearchTerm }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-8 py-4 shadow-sm">
    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="bg-blue-800 text-white p-2.5 rounded-lg shadow-md">
          <Monitor className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-black text-blue-900 tracking-tight leading-none uppercase">Maurya Portal</h1>
          <p className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-1">Digital Seva Kendra</p>
        </div>
      </div>
      <div className="relative w-full md:max-w-2xl group mx-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-700 transition-all"
          placeholder="Aadhar, PAN, Electricity, Bank खोजें..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="hidden lg:flex items-center gap-4">
        <button className="text-sm font-bold text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg">लॉगिन</button>
        <button className="bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-900">रजिस्ट्रेशन</button>
      </div>
    </div>
  </header>
);

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <a
    href={service.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white group p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[140px] hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform active:scale-95"
  >
    <div className="flex items-start justify-between">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-800 transition-all">
        <ExternalLink className="w-5 h-5 text-blue-700 group-hover:text-white" />
      </div>
      <ArrowRight className="w-4 h-4 text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="mt-4">
      <h3 className="text-[14px] font-bold text-gray-800 group-hover:text-blue-900 leading-tight line-clamp-2">
        {service.name}
      </h3>
      <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider group-hover:text-blue-600">Open Portal</p>
    </div>
  </a>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');

  const filteredServices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return SERVICES_DATA.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(term) || s.tags.some(t => t.toLowerCase().includes(term));
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, activeCategory]);

  const categories = Object.values(ServiceCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Marquee */}
      <div className="bg-blue-900 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-800">
        <div className="inline-block animate-marquee pl-[100%]">
          <span className="bg-orange-600 px-2 py-0.5 rounded text-[10px] font-bold mr-4">नया</span>
          <span className="text-sm font-medium">पैन कार्ड, आधार अपडेट और बैंकिंग सेवाएँ अब मौर्य पोर्टल पर उपलब्ध हैं। मौर्य जन सेवा केंद्र में आपका स्वागत है।</span>
        </div>
      </div>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-6 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">कैटगरी</h3>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-blue-800 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid3X3 className="w-4 h-4" />
              सभी सेवाएँ
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-blue-800 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <span className={activeCategory === cat ? 'text-white' : 'text-blue-700'}>{CATEGORY_ICONS[cat]}</span>
                <span className="truncate">{cat.split('(')[0]}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl"><Monitor className="w-6 h-6" /></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase">कुल सेवाएँ</p><p className="text-xl font-black">{SERVICES_DATA.length}+</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-700 rounded-xl"><Globe className="w-6 h-6" /></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase">सर्वर</p><p className="text-xl font-black text-green-600">एक्टिव</p></div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-700 rounded-xl"><Bell className="w-6 h-6" /></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase">नोटिफिकेशन</p><p className="text-xl font-black">5 न्यू</p></div>
            </div>
          </div>

          {categories.map(cat => {
            const services = filteredServices.filter(s => s.category === cat);
            if (services.length === 0) return null;
            return (
              <div key={cat} className="mb-10">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-2">
                  <div className="p-2 bg-blue-800 text-white rounded-lg">{CATEGORY_ICONS[cat]}</div>
                  <h2 className="text-lg font-black text-gray-800">{cat}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {services.map((s, i) => <ServiceCard key={i} service={s} />)}
                </div>
              </div>
            );
          })}

          {filteredServices.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">कोई सेवा नहीं मिली।</p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-gray-900 text-gray-500 py-10 px-6 text-center md:text-left">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-white font-black text-lg">MAURYA PORTAL</h4>
            <p className="text-xs mt-1">ग्रामीण डिजिटल सशक्तिकरण के लिए समर्पित।</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
            Made with <Heart className="w-3 h-3 text-red-600 fill-current" /> for Digital India
          </div>
          <p className="text-[10px]">© 2026 Maurya Portal | Harsh Maurya</p>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: inline-block; animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
