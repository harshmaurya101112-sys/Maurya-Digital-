
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

// --- 1. TYPES & INTERFACES (एक ही फाइल में) ---

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

// --- 2. SERVICES DATA (आपका सारा डेटा यहाँ है) ---

const SERVICES_DATA: Service[] = [
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

  // Utility
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
  { name: 'GST Portal', url: 'https://www.gst.gov.in', category: ServiceCategory.MISC, tags: ['gst', 'tax'] },
  { name: 'MSME / Udyam', url: 'https://www.udyamregistration.gov.in', category: ServiceCategory.MISC, tags: ['msme', 'udyam'] },
  { name: 'Birth/Death Cert', url: 'https://crsorgi.gov.in', category: ServiceCategory.MISC, tags: ['birth', 'death', 'certificate'] },
  { name: 'CoWIN Vaccine', url: 'https://www.cowin.gov.in', category: ServiceCategory.MISC, tags: ['vaccine', 'cowin'] },
  { name: 'E-Tenders', url: 'https://www.gepnic.gov.in', category: ServiceCategory.MISC, tags: ['tender', 'gepnic'] },
];

const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  [ServiceCategory.GOVERNMENT]: <Building2 className="w-5 h-5" />,
  [ServiceCategory.BANKING]: <Landmark className="w-5 h-5" />,
  [ServiceCategory.UTILITY]: <Zap className="w-5 h-5" />,
  [ServiceCategory.TRAVEL]: <Train className="w-5 h-5" />,
  [ServiceCategory.EDUCATION]: <GraduationCap className="w-5 h-5" />,
  [ServiceCategory.MISC]: <LayoutGrid className="w-5 h-5" />,
};

// --- 3. SUB-COMPONENTS (एक ही फाइल में) ---

const Header: React.FC<{ searchTerm: string; setSearchTerm: (v: string) => void }> = ({ searchTerm, setSearchTerm }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-8 py-4 shadow-sm">
    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <div className="bg-blue-800 text-white p-2 rounded-lg shadow-md">
          <Monitor className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-black text-blue-900 tracking-tight leading-none uppercase">Maurya Portal</h1>
          <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-[0.15em] mt-1">Digital Seva Kendra • 2026</p>
        </div>
      </div>

      <div className="relative w-full md:max-w-2xl group mx-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-700 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-inner"
          placeholder="खोजें: Aadhaar, PAN, Electricity, Bank, Scholarship..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="hidden lg:flex items-center gap-4 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
          <User className="w-4 h-4" />
          VLE लॉगिन
        </button>
        <button className="bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-black shadow-lg hover:bg-blue-900 hover:-translate-y-0.5 transition-all">
          नया रजिस्ट्रेशन
        </button>
      </div>
    </div>
  </header>
);

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <a
    href={service.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-white group relative p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[150px] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform active:scale-95 overflow-hidden"
  >
    <div className="flex items-start justify-between relative z-10">
      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-800 transition-all duration-300">
        <ExternalLink className="w-5 h-5 text-blue-700 group-hover:text-white" />
      </div>
      <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-blue-800" />
      </div>
    </div>
    <div className="mt-4 relative z-10">
      <h3 className="text-[15px] font-bold text-gray-800 group-hover:text-blue-900 leading-tight line-clamp-2">
        {service.name}
      </h3>
      <div className="flex items-center gap-1 mt-3">
        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest group-hover:text-blue-600">
          ओपन पोर्टल
        </span>
        <Globe className="w-3 h-3 text-gray-300 group-hover:text-blue-400" />
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 scale-0 group-hover:scale-150"></div>
  </a>
);

const CategorySection: React.FC<{ category: ServiceCategory; services: Service[] }> = ({ category, services }) => {
  if (services.length === 0) return null;
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-800 text-white rounded-xl shadow-lg">
            {CATEGORY_ICONS[category]}
          </div>
          <h2 className="text-lg md:text-xl font-black text-gray-800 tracking-tight">
            {category}
          </h2>
        </div>
        <span className="text-[11px] font-black text-blue-800 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          {services.length} सेवाएँ
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {services.map((s, i) => <ServiceCard key={i} service={s} />)}
      </div>
    </section>
  );
};

// --- 4. MAIN APP COMPONENT ---

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Marquee */}
      <div className="bg-blue-950 text-white py-2.5 px-4 overflow-hidden border-b border-blue-900 relative">
        <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[10px] font-black bg-orange-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
            <Bell className="w-3 h-3" /> ताज़ा अपडेट
          </span>
          <p className="text-sm font-medium tracking-wide">
            पैन कार्ड आवेदन अब मात्र 5 मिनट में। • मौर्य जन सेवा केंद्र में आपका स्वागत है। • सभी नई सेवाएँ अब लाइव हैं।
          </p>
        </div>
      </div>

      <div className="flex flex-1 max-w-[1700px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 p-8 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">सेवा श्रेणियां</h3>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-black transition-all ${activeCategory === 'All' ? 'bg-blue-800 text-white shadow-lg translate-x-2' : 'text-gray-600 hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-3">
                <Grid3X3 className="w-5 h-5 opacity-70" />
                सभी सेवाएँ
              </div>
              <span className="text-[10px] opacity-60">{SERVICES_DATA.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-black transition-all ${activeCategory === cat ? 'bg-blue-800 text-white shadow-lg translate-x-2' : 'text-gray-600 hover:bg-slate-50'}`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span className="truncate">{cat.split('(')[0]}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'कुल पोर्टल', val: SERVICES_DATA.length, icon: <Monitor />, color: 'blue' },
              { label: 'सर्वर स्टेटस', val: 'एक्टिव', icon: <Globe />, color: 'green' },
              { label: 'अपडेट्स', val: 'न्यू', icon: <Bell />, color: 'orange' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                <div className={`bg-${s.color}-50 p-4 rounded-2xl`}>{React.cloneElement(s.icon as any, { className: `w-7 h-7 text-${s.color}-700` })}</div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase">{s.label}</p>
                  <p className="text-2xl font-black text-gray-800">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-20">
            {activeCategory === 'All' 
              ? categories.map(cat => <CategorySection key={cat} category={cat} services={filteredServices.filter(s => s.category === cat)} />)
              : <CategorySection category={activeCategory as ServiceCategory} services={filteredServices} />
            }
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-800">कोई सेवा नहीं मिली</h3>
              <button onClick={() => {setSearchTerm(''); setActiveCategory('All');}} className="mt-8 px-8 py-3 bg-blue-800 text-white rounded-xl font-black text-sm uppercase">सब देखें</button>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-950 text-slate-400 py-16 px-8 text-center md:text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h4 className="text-white font-black text-xl mb-4 uppercase">MAURYA PORTAL</h4>
            <p className="text-sm opacity-70">मौर्य जन सेवा केंद्र - आपका अपना डिजिटल साथी।</p>
          </div>
          <div>
            <h4 className="text-white font-black text-xs uppercase mb-8 tracking-widest">लिंक्स</h4>
            <ul className="text-sm space-y-4 font-bold">
              <li><a href="#" className="hover:text-white">डैशबोर्ड</a></li>
              <li><a href="#" className="hover:text-white">गोपनीयता</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center gap-1.5 text-xs text-orange-500 font-black uppercase mb-6">
              <span>Made with</span><Heart className="w-3 h-3 fill-current" /><span>for Digital India</span>
            </div>
            <p className="text-[10px] opacity-40">© 2026 Maurya Portal • Harsh Maurya</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
};

export default App;
