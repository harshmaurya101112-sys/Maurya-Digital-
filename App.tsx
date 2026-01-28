
import React, { useState, useMemo } from 'react';
import { 
  Search, Flashlight, User, Home as HomeIcon, History, Bell, Menu, X, 
  Fingerprint, IdCard, Briefcase, HeartPulse, Sprout, Vote, Book, 
  Wallet, ShieldCheck, PieChart, Monitor, GraduationCap, Brain, 
  Zap, TrainFront, Car, FileBadge, IndianRupee, Home, Baby, 
  Accessibility, Heart, Map, HardHat, Users, UserCheck, PiggyBank, 
  Building2, Gauge, BarChart, Settings, DraftingCompass, Store, 
  Leaf, Mountain, Sun, Umbrella, Bus, Plane, Receipt, Info, 
  AlertTriangle, Gavel, Banknote, FileText, Cloud, Phone, ExternalLink
} from 'lucide-react';

// --- Types ---
type CategoryCode = 'G2C' | 'Bank' | 'Edu' | 'Util';

interface Service {
  name: string;
  cat: CategoryCode;
  url: string;
  iconName: string;
  keywords: string[]; // English and alternative keywords
}

interface Category {
  code: CategoryCode;
  title: string;
  description: string;
}

// --- Constants & Data ---
const CATEGORIES: Category[] = [
  { code: 'G2C', title: 'सरकारी सेवाएं (G2C)', description: 'Government to Citizen Services' },
  { code: 'Bank', title: 'बैंकिंग और बीमा', description: 'Banking, Insurance & Pension' },
  { code: 'Edu', title: 'शिक्षा और कौशल', description: 'Education & Skill Development' },
  { code: 'Util', title: 'यूटिलिटी बिल एवं यात्रा', description: 'Utility Payments & Travel' },
];

const ALL_SERVICES: Service[] = [
  // G2C - सरकारी सेवाएँ
  { name: "आधार कार्ड", cat: "G2C", url: "https://uidai.gov.in", iconName: "Fingerprint", keywords: ["aadhar", "uidai", "card", "download", "biometric", "address update"] },
  { name: "पैन कार्ड", cat: "G2C", url: "https://www.onlineservices.nsdl.com", iconName: "IdCard", keywords: ["pan", "income tax", "card", "nsdl", "uti", "pancard"] },
  { name: "ई-श्रम रजिस्ट्रेशन", cat: "G2C", url: "https://eshram.gov.in", iconName: "Briefcase", keywords: ["eshram", "labour", "card", "shramik", "worker"] },
  { name: "आयुष्मान कार्ड", cat: "G2C", url: "https://bis.pmjay.gov.in", iconName: "HeartPulse", keywords: ["ayushman", "health", "golden card", "pmjay", "hospital", "modi care"] },
  { name: "PM किसान", cat: "G2C", url: "https://pmkisan.gov.in", iconName: "Sprout", keywords: ["kisan", "farmer", "pmkisan", "installment", "paisa", "agriculture"] },
  { name: "वोटर सर्विस", cat: "G2C", url: "https://voters.eci.gov.in", iconName: "Vote", keywords: ["voter", "election", "id card", "epic", "vote", "voterid"] },
  { name: "पासपोर्ट सेवा", cat: "G2C", url: "https://www.passportindia.gov.in", iconName: "Book", keywords: ["passport", "travel", "visa", "appointment", "external affairs"] },
  { name: "जाति प्रमाण पत्र", cat: "G2C", url: "https://edistrict.up.gov.in", iconName: "FileBadge", keywords: ["caste", "jati", "certificate", "edistrict", "sc", "st", "obc"] },
  { name: "आय प्रमाण पत्र", cat: "G2C", url: "https://edistrict.up.gov.in", iconName: "IndianRupee", keywords: ["income", "aay", "salary", "certificate", "low income"] },
  { name: "निवास प्रमाण पत्र", cat: "G2C", url: "https://edistrict.up.gov.in", iconName: "Home", keywords: ["domicile", "niwas", "address", "residence", "proof"] },
  { name: "जन्म प्रमाण पत्र", cat: "G2C", url: "https://crsorgi.gov.in", iconName: "Baby", keywords: ["birth", "janm", "certificate", "newborn", "mcd"] },
  { name: "दिव्यांग प्रमाण पत्र", cat: "G2C", url: "https://www.swavlambancard.gov.in", iconName: "Accessibility", keywords: ["disabled", "divyang", "handicap", "disability", "card", "udid"] },
  { name: "खतौनी (भूलेख)", cat: "G2C", url: "https://upbhulekh.gov.in", iconName: "Map", keywords: ["khatauni", "bhulekh", "land", "records", "map", "khet", "zameen"] },
  { name: "डिजीलॉकर", cat: "G2C", url: "https://www.digilocker.gov.in", iconName: "Cloud", keywords: ["digilocker", "documents", "cloud", "marksheet", "driving license", "storage"] },

  // Banking & Insurance
  { name: "DigiPay (AEPS)", cat: "Bank", url: "https://digipay.csccloud.in", iconName: "Wallet", keywords: ["digipay", "aeps", "cash", "withdrawal", "atm", "fingerprint money"] },
  { name: "बीमा प्रीमियम", cat: "Bank", url: "https://digitalseva.csc.gov.in/", iconName: "ShieldCheck", keywords: ["insurance", "lic", "premium", "policy", "bima", "renew"] },
  { name: "SBI नेट बैंकिंग", cat: "Bank", url: "https://www.onlinesbi.sbi", iconName: "Building2", keywords: ["sbi", "state bank", "netbanking", "login", "bank"] },
  { name: "मुद्रा लोन", cat: "Bank", url: "https://www.mudra.org.in", iconName: "IndianRupee", keywords: ["mudra", "loan", "business", "paisa", "startup", "credit"] },
  { name: "क्रेडिट स्कोर", cat: "Bank", url: "https://www.cibil.com", iconName: "Gauge", keywords: ["cibil", "credit", "score", "loan", "rating"] },

  // Education & Skill
  { name: "PMGDisha", cat: "Edu", url: "https://www.pmgdisha.in", iconName: "Monitor", keywords: ["pmgdisha", "computer", "course", "education", "digital literacy"] },
  { name: "यूपी स्कॉलरशिप", cat: "Edu", url: "https://scholarship.up.gov.in", iconName: "GraduationCap", keywords: ["scholarship", "up", "student", "paisa", "fee", "refund"] },
  { name: "NIOS एडमिशन", cat: "Edu", url: "https://sdmis.nios.ac.in", iconName: "GraduationCap", keywords: ["nios", "open school", "admission", "board", "exam", "10th", "12th"] },

  // Utility & Travel
  { name: "बिजली बिल", cat: "Util", url: "https://www.bbps.org.in", iconName: "Zap", keywords: ["electricity", "light", "bill", "power", "uppcl", "energy"] },
  { name: "IRCTC टिकट", cat: "Util", url: "https://www.irctc.co.in", iconName: "TrainFront", keywords: ["train", "railway", "irctc", "ticket", "berth", "tatkal", "seat"] },
  { name: "FASTag", cat: "Util", url: "https://www.fastag.org", iconName: "Car", keywords: ["fastag", "toll", "car", "highway", "recharge", "tollgate"] },
  { name: "गाड़ी का RC स्टेटस", cat: "Util", url: "https://vahan.parivahan.gov.in", iconName: "Info", keywords: ["rc", "vahan", "vehicle", "car", "bike", "transport", "owner"] },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Fingerprint: <Fingerprint />, IdCard: <IdCard />, Briefcase: <Briefcase />,
  HeartPulse: <HeartPulse />, Sprout: <Sprout />, Vote: <Vote />,
  Book: <Book />, Wallet: <Wallet />, ShieldCheck: <ShieldCheck />,
  PieChart: <PieChart />, Monitor: <Monitor />, GraduationCap: <GraduationCap />,
  Brain: <Brain />, Zap: <Zap />, TrainFront: <TrainFront />,
  Car: <Car />, FileBadge: <FileBadge />, IndianRupee: <IndianRupee />,
  Home: <Home />, Baby: <Baby />, Accessibility: <Accessibility />,
  Heart: <Heart />, Map: <Map />, HardHat: <HardHat />,
  Users: <Users />, UserCheck: <UserCheck />, PiggyBank: <PiggyBank />,
  Building2: <Building2 />, Gauge: <Gauge />, BarChart: <BarChart />,
  Settings: <Settings />, DraftingCompass: <DraftingCompass />, Store: <Store />,
  Leaf: <Leaf />, Mountain: <Mountain />, Sun: <Sun />,
  Umbrella: <Umbrella />, Bus: <Bus />, Plane: <Plane />,
  Receipt: <Receipt />, Info: <Info />, AlertTriangle: <AlertTriangle />,
  Gavel: <Gavel />, Banknote: <Banknote />, FileText: <FileText />,
  Cloud: <Cloud />
};

// --- Helper Components ---
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const getCategoryColor = (cat: CategoryCode) => {
    switch (cat) {
      case 'G2C': return 'bg-orange-100 text-orange-600 active:bg-orange-200';
      case 'Bank': return 'bg-blue-100 text-blue-600 active:bg-blue-200';
      case 'Edu': return 'bg-green-100 text-green-600 active:bg-green-200';
      case 'Util': return 'bg-purple-100 text-purple-600 active:bg-purple-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center justify-start p-2 transition-all transform active:scale-90"
    >
      <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl shadow-sm transition-colors ${getCategoryColor(service.cat)} mb-2`}>
        {React.cloneElement(ICON_MAP[service.iconName] as React.ReactElement<any>, { 
          className: "w-7 h-7 md:w-8 md:h-8 stroke-[1.5px]" 
        })}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-gray-700 text-center line-clamp-2 leading-tight">
        {service.name}
      </span>
    </a>
  );
};

const CategorySection: React.FC<{ category: Category, services: Service[] }> = ({ category, services }) => {
  if (services.length === 0) return null;
  return (
    <section className="mb-8">
      <div className="flex items-baseline justify-between px-5 mb-4">
        <h2 className="text-base font-extrabold text-gray-800 tracking-tight">{category.title}</h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{services.length} सेवाएं</span>
      </div>
      <div className="bg-white mx-4 rounded-[2.5rem] p-5 shadow-sm border border-gray-100 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-6 gap-x-2">
        {services.map((service, idx) => (
          <ServiceCard key={idx} service={service} />
        ))}
      </div>
    </section>
  );
};

// --- Main App Component ---
export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // --- Search Logic (Bilingual) ---
  const filteredServices = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ALL_SERVICES;
    return ALL_SERVICES.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.keywords.some(k => k.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto bg-gray-50 pb-24 relative overflow-x-hidden">
      
      {/* Header */}
      <header className="bg-orange-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-inner active:scale-95 transition-transform cursor-pointer">
              <Flashlight className="w-5 h-5 text-orange-600 fill-orange-600" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter leading-none uppercase">Maurya Digital</h1>
              <p className="text-[10px] font-bold opacity-75 uppercase tracking-[0.2em]">CSC Official Hub</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => setIsNotificationsOpen(true)}
              className="p-2.5 bg-orange-500/30 hover:bg-orange-500 rounded-xl transition-colors relative active:scale-90"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-orange-600 animate-pulse"></span>
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 bg-orange-500/30 hover:bg-orange-500 rounded-xl transition-colors active:scale-90"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar - Fixed to support both languages */}
        <div className="px-5 pb-6 pt-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="खोजें / Search (e.g. Aadhar, PAN, बिजली...)"
              className="block w-full pl-12 pr-4 py-4 bg-white text-gray-900 border-none rounded-2xl shadow-xl focus:ring-4 focus:ring-orange-500/30 text-sm transition-all outline-none font-medium placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mt-6 animate-fade-up">
        {searchQuery ? (
          <div className="px-4">
            <h2 className="text-[10px] font-black text-gray-400 mb-4 px-3 uppercase tracking-widest">
              खोज परिणाम / Results ({filteredServices.length})
            </h2>
            <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-6 gap-x-2">
              {filteredServices.map((service, idx) => (
                <ServiceCard key={idx} service={service} />
              ))}
              {filteredServices.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold text-sm">कोई सेवा नहीं मिली / Not Found</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          CATEGORIES.map(category => (
            <CategorySection 
              key={category.code}
              category={category}
              services={ALL_SERVICES.filter(s => s.cat === category.code)}
            />
          ))
        )}
      </main>

      {/* Support Section */}
      <div className="px-4 mt-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-1 italic tracking-tight uppercase">Technical Support</h3>
            <p className="text-xs opacity-60 mb-5 leading-relaxed font-medium">Any issues with Aadhar or PAN? Our tech experts are here.</p>
            <div className="flex gap-3">
              <a href="tel:+910000000000" className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-600/20">
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95">
                Support Chat
              </button>
            </div>
          </div>
          <Settings className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
        </div>
      </div>

      {/* --- Overlay Modals (Mobile-Fixed) --- */}

      {/* Side Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black text-gray-800 tracking-tighter">APP SETTINGS</h2>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-xl text-gray-500 active:scale-90">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 flex-1">
              {[
                { label: 'Profile Settings', icon: User },
                { label: 'Notification Preferences', icon: Bell },
                { label: 'Dark Mode (Beta)', icon: Settings },
                { label: 'Language / भाषा', icon: Info },
                { label: 'Help & Feedback', icon: Phone },
                { label: 'About App', icon: Info },
              ].map((item, idx) => (
                <button key={idx} className="w-full text-left py-4 px-5 rounded-2xl hover:bg-orange-50 font-bold text-gray-700 text-sm flex items-center gap-4 group transition-all active:bg-orange-100">
                  <item.icon className="w-5 h-5 text-gray-300 group-hover:text-orange-500" />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-[10px] text-orange-600 font-bold uppercase mb-1">Developer Status</p>
              <p className="text-xs font-black text-gray-800 tracking-widest">v2.4.5 - STABLE RELEASE</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}>
          <div 
            className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-2 rounded-xl">
                  <Bell className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-black text-gray-800">नयी सूचनाएं</h2>
              </div>
              <button onClick={() => setIsNotificationsOpen(false)} className="p-2 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-xs font-black text-gray-800 mb-1 leading-tight">आधार कार्ड डाउनलोड सेवा अपडेट!</p>
                <p className="text-[10px] text-gray-500 font-medium">New fingerprint servers are now active.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                <p className="text-xs font-black text-gray-800 mb-1 leading-tight">Server Maintenance: UIDAI</p>
                <p className="text-[10px] text-gray-500 font-medium">11:00 PM to 01:00 AM tonight.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full mt-6 bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            >
              ठीक है (Got it)
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center py-4 px-6 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
        <button 
          onClick={() => { setActiveTab('home'); setSearchQuery(''); }}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'home' ? 'text-orange-600 scale-110' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <HomeIcon className={`w-6 h-6 ${activeTab === 'home' ? 'fill-orange-600/10' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'history' ? 'text-orange-600 scale-110' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'profile' ? 'text-orange-600 scale-110' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-orange-600/10' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </nav>
    </div>
  );
}
