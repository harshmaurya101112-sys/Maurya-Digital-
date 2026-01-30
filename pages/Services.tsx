
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, CreditCard, Landmark, Smartphone, FileText, Zap, 
  ChevronRight, Lock, Globe, ExternalLink, ShieldCheck, 
  User, Briefcase, GraduationCap, Plane, HeartPulse, ShieldAlert, BookOpen
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  cost: number;
  category: string;
  officialUrl?: string;
  brandColor: string;
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [step, setStep] = useState<'browse' | 'form' | 'payment'>('browse');
  const [pin, setPin] = useState('');
  const [formFields, setFormFields] = useState({ name: '', number: '', remark: '' });

  const categories = ['All', 'Banking', 'Govt Portal', 'Identity', 'Utilities', 'Travel', 'Education', 'Health', 'Insurance'];

  const allServices = useMemo(() => {
    const base: ServiceItem[] = [
      // Core Banking
      { id: 'b1', name: 'Aadhar Pay (Withdrawal)', icon: <Landmark />, cost: 0, category: 'Banking', brandColor: 'bg-blue-600' },
      { id: 'b2', name: 'Instant Money Transfer (DMT)', icon: <CreditCard />, cost: 10, category: 'Banking', brandColor: 'bg-blue-700' },
      { id: 'b3', name: 'Mini Statement', icon: <FileText />, cost: 1, category: 'Banking', brandColor: 'bg-indigo-600' },
      { id: 'b4', name: 'SBI Account Opening', icon: <Landmark />, cost: 50, category: 'Banking', brandColor: 'bg-blue-800' },
      { id: 'b5', name: 'HDFC Bank Portal', icon: <Briefcase />, cost: 100, category: 'Banking', brandColor: 'bg-slate-900' },
      { id: 'b6', name: 'PNB Digital Account', icon: <Landmark />, cost: 50, category: 'Banking', brandColor: 'bg-red-800' },
      
      // Identity & Verification
      { id: 'i1', name: 'NSDL PAN Card', icon: <User />, cost: 107, category: 'Identity', brandColor: 'bg-orange-600', officialUrl: 'https://www.onlineservices.nsdl.com/' },
      { id: 'i2', name: 'UTI PAN Card', icon: <User />, cost: 107, category: 'Identity', brandColor: 'bg-orange-700', officialUrl: 'https://www.utiitsl.com/' },
      { id: 'i3', name: 'Aadhar Download (UIDAI)', icon: <Smartphone />, cost: 10, category: 'Identity', brandColor: 'bg-red-600' },
      { id: 'i4', name: 'New Voter ID (NVSP)', icon: <ShieldCheck />, cost: 0, category: 'Identity', brandColor: 'bg-emerald-600' },
      { id: 'i5', name: 'Passport Seva Portal', icon: <Globe />, cost: 1500, category: 'Identity', brandColor: 'bg-blue-900' },
      { id: 'i6', name: 'Driving License (Sarathi)', icon: <ShieldAlert />, cost: 250, category: 'Identity', brandColor: 'bg-slate-700' },

      // Central Govt Portals
      { id: 'g1', name: 'Ayushman Card (BIS)', icon: <HeartPulse />, cost: 15, category: 'Govt Portal', brandColor: 'bg-green-600' },
      { id: 'g2', name: 'E-Shram Card Registration', icon: <Briefcase />, cost: 10, category: 'Govt Portal', brandColor: 'bg-orange-500' },
      { id: 'g3', name: 'PM Kisan Samman Nidhi', icon: <Landmark />, cost: 0, category: 'Govt Portal', brandColor: 'bg-green-700' },
      { id: 'g4', name: 'Digital Life Certificate', icon: <User />, cost: 10, category: 'Govt Portal', brandColor: 'bg-sky-500' },
      
      // Utilities
      { id: 'u1', name: 'Electricity (UPPCL)', icon: <Zap />, cost: 0, category: 'Utilities', brandColor: 'bg-yellow-600' },
      { id: 'u2', name: 'Electricity (Bihar SBPDCL)', icon: <Zap />, cost: 0, category: 'Utilities', brandColor: 'bg-yellow-700' },
      { id: 'u3', name: 'Mobile Recharge (Jio/Airtel)', icon: <Smartphone />, cost: 0, category: 'Utilities', brandColor: 'bg-pink-600' },
      { id: 'u4', name: 'Gas Booking (Indane/HP)', icon: <Zap />, cost: 0, category: 'Utilities', brandColor: 'bg-orange-400' },
      { id: 'u5', name: 'LIC Premium Payment', icon: <HeartPulse />, cost: 0, category: 'Insurance', brandColor: 'bg-blue-800' },

      // Education
      { id: 'e1', name: 'CBSE Result Portal', icon: <BookOpen />, cost: 0, category: 'Education', brandColor: 'bg-blue-500' },
      { id: 'e2', name: 'UP Scholarship Portal', icon: <GraduationCap />, cost: 0, category: 'Education', brandColor: 'bg-violet-600' },
      { id: 'e3', name: 'University Form (IGNOU)', icon: <GraduationCap />, cost: 20, category: 'Education', brandColor: 'bg-red-900' },
    ];

    const states = [
      'UP', 'Bihar', 'Rajasthan', 'MP', 'Maharashtra', 'Gujarat', 'Haryana', 
      'Punjab', 'West Bengal', 'Delhi', 'Uttarakhand', 'Jharkhand', 'Chhattisgarh',
      'Assam', 'Odisha', 'Kerala', 'Tamil Nadu', 'Karnataka', 'Telangana', 'AP',
      'Himachal', 'Jammu', 'Ladakh', 'Goa', 'Sikkim', 'Tripura', 'Manipur', 'Meghalaya'
    ];
    
    const stateServices = [
      { name: 'Caste Certificate', cost: 20 },
      { name: 'Income Certificate', cost: 20 },
      { name: 'Residence Proof', cost: 20 },
      { name: 'Ration Card Online', cost: 30 },
      { name: 'Marriage Registration', cost: 100 },
      { name: 'Birth Certificate', cost: 50 },
      { name: 'Death Certificate', cost: 50 },
      { name: 'Land Record (Bhulekh)', cost: 10 }
    ];

    const extended: ServiceItem[] = [];
    states.forEach(state => {
      stateServices.forEach(srv => {
        extended.push({
          id: `st-${state}-${srv.name.replace(/\s+/g, '-')}`,
          name: `${state} ${srv.name}`,
          icon: <FileText />,
          cost: srv.cost,
          category: 'Govt Portal',
          brandColor: 'bg-slate-600'
        });
      });
    });

    return [...base, ...extended];
  }, []);

  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const startApplication = (service: ServiceItem) => {
    setSelectedService(service);
    setStep('form');
  };

  const handleFinalPayment = () => {
    if (!selectedService) return;
    if (user.walletBalance < selectedService.cost) return alert("अपर्याप्त बैलेंस!");
    if (user.walletPin && !pin) return alert("पिन अनिवार्य है!");
    
    onAction(selectedService.cost, selectedService.name, 'debit', pin);
    setSelectedService(null);
    setStep('browse');
    setPin('');
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">Service Store</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">250+ LIVE PORTALS AVAILABLE</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search services (e.g. PAN, UP Caste, SBI)..." 
              className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                activeCategory === cat 
                ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/20' 
                : 'bg-white text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {filtered.map(service => (
          <div 
            key={service.id}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className={`${service.brandColor} text-white p-5 rounded-3xl w-fit mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                {React.cloneElement(service.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <h3 className="font-black text-slate-900 text-sm mb-1 uppercase leading-tight">{service.name}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{service.category}</p>
            </div>
            
            <div className="mt-8 flex items-center justify-between gap-4">
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase block">Charges</span>
                <span className="text-sm font-black text-blue-900">₹{service.cost}</span>
              </div>
              <button 
                onClick={() => startApplication(service)}
                className="bg-blue-50 text-blue-600 hover:bg-blue-900 hover:text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center gap-2"
              >
                Apply <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-[500] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`${selectedService.brandColor} p-10 text-white flex justify-between items-center`}>
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                  {selectedService.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{selectedService.name}</h2>
                  <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{selectedService.category} Portal</p>
                </div>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-white/50 hover:text-white font-black text-3xl">×</button>
            </div>

            <div className="p-12">
              {step === 'form' ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                      <input 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500" 
                        placeholder="Applicant Name"
                        value={formFields.name}
                        onChange={e => setFormFields({...formFields, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aadhar / Mobile Number</label>
                      <input 
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-blue-500" 
                        placeholder="XXXX-XXXX-XXXX"
                        value={formFields.number}
                        onChange={e => setFormFields({...formFields, number: e.target.value})}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep('payment')}
                    className="w-full bg-blue-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3"
                  >
                    Confirm & Proceed <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Available Balance</span>
                      <span className="font-black text-slate-900">₹{user.walletBalance.toLocaleString('hi-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-blue-50 rounded-2xl border border-blue-100">
                      <span className="text-[10px] font-black text-blue-600 uppercase">Deduction Amount</span>
                      <span className="text-xl font-black text-blue-900">₹{selectedService.cost}</span>
                    </div>
                  </div>

                  {user.walletPin && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-center">
                        <Lock size={12} /> Enter Security PIN
                      </label>
                      <input 
                        type="password" 
                        maxLength={6}
                        placeholder="••••" 
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center font-black text-4xl tracking-[1em] outline-none focus:border-blue-500"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setStep('form')} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs">Back</button>
                    <button 
                      onClick={handleFinalPayment}
                      className="flex-2 w-full bg-blue-900 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl"
                    >
                      Confirm Transaction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
