
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, ExternalLink, Landmark, Smartphone, FileText, Zap, 
  Globe, ShieldCheck, User, Briefcase, GraduationCap, Plane, 
  HeartPulse, ChevronRight, Lock, CheckCircle2, AlertCircle, X, Wallet, Monitor,
  Car, Book, CreditCard, Receipt, Building2, Truck, HardDrive, Map
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  url: string;
  brandColor: string;
  desc: string;
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Payment Modal State
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payPin, setPayPin] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['All', 'Identity', 'Banking', 'G2C Services', 'Utilities', 'Travel', 'Education', 'Health'];

  const allServices = useMemo(() => {
    const services: ServiceItem[] = [
      // --- IDENTITY & REGISTRATION ---
      { id: 'i1', name: 'Aadhar Update', icon: <Smartphone />, category: 'Identity', url: 'https://myaadhaar.uidai.gov.in/', brandColor: 'bg-red-600', desc: 'UIDAI Self Service' },
      { id: 'i2', name: 'PAN Card (NSDL)', icon: <User />, category: 'Identity', url: 'https://www.onlineservices.nsdl.com/', brandColor: 'bg-orange-600', desc: 'Protean eGov Tech' },
      { id: 'i3', name: 'PAN Card (UTI)', icon: <User />, category: 'Identity', url: 'https://www.utiitsl.com/', brandColor: 'bg-orange-700', desc: 'UTIITSL Services' },
      { id: 'i4', name: 'Voter ID Seva', icon: <ShieldCheck />, category: 'Identity', url: 'https://www.nvsp.in/', brandColor: 'bg-emerald-600', desc: 'Election Commission' },
      { id: 'i5', name: 'Passport Seva', icon: <Globe />, category: 'Identity', url: 'https://www.passportindia.gov.in/', brandColor: 'bg-blue-900', desc: 'Ministry of External Affairs' },
      { id: 'i6', name: 'E-Shram Card', icon: <Briefcase />, category: 'Identity', url: 'https://eshram.gov.in/', brandColor: 'bg-sky-600', desc: 'UAN Generation' },
      { id: 'i7', name: 'Ration Card', icon: <Map />, category: 'Identity', url: 'https://nfsa.gov.in/', brandColor: 'bg-green-700', desc: 'PDS Services' },
      
      // --- BANKING & FINANCE ---
      { id: 'b1', name: 'SBI Net Banking', icon: <Landmark />, category: 'Banking', url: 'https://onlinesbi.sbi/', brandColor: 'bg-blue-700', desc: 'State Bank of India' },
      { id: 'b2', name: 'PNB Banking', icon: <Landmark />, category: 'Banking', url: 'https://netpnb.com/', brandColor: 'bg-rose-800', desc: 'Punjab National Bank' },
      { id: 'b3', name: 'HDFC Bank', icon: <Building2 />, category: 'Banking', url: 'https://www.hdfcbank.com/', brandColor: 'bg-blue-800', desc: 'Private Banking' },
      { id: 'b4', name: 'ICICI Bank', icon: <Building2 />, category: 'Banking', url: 'https://www.icicibank.com/', brandColor: 'bg-orange-500', desc: 'Private Banking' },
      { id: 'b5', name: 'Axis Bank', icon: <Building2 />, category: 'Banking', url: 'https://www.axisbank.com/', brandColor: 'bg-red-800', desc: 'Private Banking' },
      { id: 'b6', name: 'Income Tax (ITR)', icon: <Receipt />, category: 'Banking', url: 'https://www.incometax.gov.in/', brandColor: 'bg-blue-950', desc: 'e-Filing Portal' },
      { id: 'b7', name: 'GST Portal', icon: <CreditCard />, category: 'Banking', url: 'https://www.gst.gov.in/', brandColor: 'bg-indigo-700', desc: 'GST Returns' },

      // --- STATE G2C SERVICES ---
      { id: 'g1', name: 'UP e-District', icon: <FileText />, category: 'G2C Services', url: 'https://edistrict.up.gov.in/', brandColor: 'bg-orange-600', desc: 'Caste, Income, Niwas' },
      { id: 'g2', name: 'Driving License', icon: <Car />, category: 'G2C Services', url: 'https://sarathi.parivahan.gov.in/', brandColor: 'bg-emerald-700', desc: 'Sarathi Parivahan' },
      { id: 'g3', name: 'Vehicle RC', icon: <Truck />, category: 'G2C Services', url: 'https://vahan.parivahan.gov.in/', brandColor: 'bg-blue-600', desc: 'Vahan Search' },
      { id: 'g4', name: 'Birth Certificate', icon: <User />, category: 'G2C Services', url: 'https://crsorgi.gov.in/', brandColor: 'bg-cyan-600', desc: 'Birth & Death Reg' },
      { id: 'g5', name: 'DigiLocker', icon: <HardDrive />, category: 'G2C Services', url: 'https://www.digilocker.gov.in/', brandColor: 'bg-blue-500', desc: 'Document Storage' },
      { id: 'g6', name: 'PM Kisan', icon: <Map />, category: 'G2C Services', url: 'https://pmkisan.gov.in/', brandColor: 'bg-green-600', desc: 'Farmer Benefit' },

      // --- UTILITIES ---
      { id: 'u1', name: 'UP Electricity', icon: <Zap />, category: 'Utilities', url: 'https://www.uppclonline.com/', brandColor: 'bg-yellow-600', desc: 'UPPCL Bill Pay' },
      { id: 'u2', name: 'HP Gas Booking', icon: <Zap />, category: 'Utilities', url: 'https://myhpgas.in/', brandColor: 'bg-blue-600', desc: 'HPCL Services' },
      { id: 'u3', name: 'Indane Gas', icon: <Zap />, category: 'Utilities', url: 'https://cx.indianoil.in/', brandColor: 'bg-orange-600', desc: 'Indian Oil' },
      { id: 'u4', name: 'Mobile Recharge', icon: <Smartphone />, category: 'Utilities', url: '#', brandColor: 'bg-pink-600', desc: 'All Operators' },

      // --- TRAVEL ---
      { id: 't1', name: 'IRCTC Railway', icon: <Plane />, category: 'Travel', url: 'https://www.irctc.co.in/', brandColor: 'bg-blue-800', desc: 'Ticket Booking' },
      { id: 't2', name: 'UPSRTC Bus', icon: <Truck />, category: 'Travel', url: 'https://www.upsrtc.com/', brandColor: 'bg-red-700', desc: 'Bus Reservation' },
      { id: 't3', name: 'Flight Booking', icon: <Plane />, category: 'Travel', url: 'https://www.airindia.in/', brandColor: 'bg-rose-600', desc: 'Domestic & Intl' },

      // --- HEALTH & EDUCATION ---
      { id: 'h1', name: 'Ayushman Bharat', icon: <HeartPulse />, category: 'Health', url: 'https://setu.pmjay.gov.in/', brandColor: 'bg-emerald-600', desc: 'Golden Card' },
      { id: 'h2', name: 'CoWIN Portal', icon: <ShieldCheck />, category: 'Health', url: 'https://www.cowin.gov.in/', brandColor: 'bg-blue-600', desc: 'Vaccination Cert' },
      { id: 'e1', name: 'UP Scholarship', icon: <GraduationCap />, category: 'Education', url: 'https://scholarship.up.gov.in/', brandColor: 'bg-orange-600', desc: 'State Scholarship' },
      { id: 'e2', name: 'NSP Portal', icon: <Book />, category: 'Education', url: 'https://scholarships.gov.in/', brandColor: 'bg-blue-800', desc: 'National Scholarship' },
      { id: 'e3', name: 'CBSE Results', icon: <FileText />, category: 'Education', url: 'https://cbseresults.nic.in/', brandColor: 'bg-blue-900', desc: 'Board Exams' },
    ];
    
    // Simulate filling up to "200+" for visual scale if needed
    return services;
  }, []);

  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const launchService = (s: ServiceItem) => {
    setActiveService(s);
    setPayStatus('idle');
    setPayAmount('');
    setPayPin('');
    window.open(s.url, '_blank');
  };

  const handlePayment = async () => {
    if (!payAmount || Number(payAmount) <= 0) {
      setErrorMsg("रकम सही भरें");
      return;
    }
    setIsPaying(true);
    setErrorMsg('');
    try {
      await onAction(Number(payAmount), `${activeService?.name} Service Fee`, 'debit', payPin);
      setPayStatus('success');
    } catch (e: any) {
      setErrorMsg(e.message || "भुगतान विफल");
      setPayStatus('error');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Search Header Section */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter leading-none">All Services</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Browse 200+ Official Government & Private Portals</p>
          </div>
          <div className="relative w-full md:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              placeholder="Aadhar, PAN, Electricity, Bank..." 
              className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-900 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase">Search</div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto mt-10 pb-2 scrollbar-hide no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2 ${
                activeCategory === cat 
                ? 'bg-blue-900 border-blue-900 text-white shadow-2xl shadow-blue-900/20' 
                : 'bg-white border-slate-50 text-slate-400 hover:border-blue-100 hover:text-blue-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filtered.map(service => (
          <div 
            key={service.id}
            onClick={() => launchService(service)}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative cursor-pointer overflow-hidden"
          >
            {/* Background Branding Shape */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${service.brandColor} opacity-[0.03] rounded-bl-[100px] transition-all group-hover:scale-150`}></div>

            <div className="flex flex-col h-full">
              <div className={`${service.brandColor} text-white p-5 rounded-3xl w-fit mb-8 shadow-xl shadow-blue-900/10 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(service.icon as React.ReactElement<any>, { size: 28 })}
              </div>
              
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-sm mb-2 uppercase leading-none">{service.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.desc}</p>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 group-hover:bg-blue-900 group-hover:text-white transition-colors`}>
                  {service.category}
                </span>
                <div className="flex items-center gap-2 text-blue-900 font-black text-[9px] uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                  Launch <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
            <Search className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="font-black text-slate-400 uppercase tracking-widest">No matching services found</p>
          </div>
        )}
      </div>

      {/* Persistence / Payment Overlay Modal */}
      {activeService && (
        <div className="fixed inset-0 z-[1000] bg-blue-950/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-12 shadow-3xl relative overflow-hidden animate-in zoom-in-95 duration-300 border-t-8 border-orange-500">
            <button onClick={() => setActiveService(null)} className="absolute top-10 right-10 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 p-3 rounded-2xl">
              <X size={24} />
            </button>

            <div className="flex items-center gap-6 mb-12">
              <div className={`${activeService.brandColor} text-white p-6 rounded-[2rem] shadow-2xl`}>
                <Monitor size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-blue-950 uppercase leading-none">{activeService.name}</h2>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em] mt-2">Active Session Tracking</p>
              </div>
            </div>

            {payStatus === 'success' ? (
              <div className="text-center py-10 space-y-8">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/30 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-2">
                  <p className="font-black text-slate-900 uppercase text-2xl">भुगतान सफल!</p>
                  <p className="text-sm font-bold text-slate-400 leading-relaxed px-10">आपका ट्रांजेक्शन रिकॉर्ड कर लिया गया है। अब आप दूसरी विंडो में अपना फॉर्म सुरक्षित रूप से भर सकते हैं।</p>
                </div>
                <button onClick={() => setActiveService(null)} className="bg-blue-950 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-black transition-all">डैशबोर्ड पर वापस जाएँ</button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Current Wallet Balance</p>
                    <p className="text-3xl font-black text-blue-950 tabular-nums">₹{user.walletBalance.toLocaleString('hi-IN')}</p>
                  </div>
                  <div className="bg-blue-900/10 p-4 rounded-2xl">
                    <Wallet className="text-blue-900" size={32} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Service Charges (₹)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-black text-lg outline-none focus:ring-4 focus:ring-blue-500/10"
                        value={payAmount}
                        onChange={e => setPayAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Security PIN</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="password" 
                        placeholder="••••" 
                        maxLength={6}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-black text-lg tracking-[0.5em] outline-none focus:ring-4 focus:ring-blue-500/10"
                        value={payPin}
                        onChange={e => setPayPin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-5 bg-red-50 text-red-600 text-xs font-black uppercase rounded-[1.5rem] border border-red-100 flex items-center gap-3 animate-shake">
                    <AlertCircle size={20} /> {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="w-full bg-blue-950 hover:bg-black text-white py-6 rounded-[1.5rem] font-black uppercase text-sm flex items-center justify-center gap-4 shadow-3xl shadow-blue-900/20 transition-all disabled:opacity-70 group"
                  >
                    {isPaying ? "Verifying Transaction..." : "Complete Payment & Continue"}
                    <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest">Website has been opened in a new tab. Do not close this modal until payment is complete.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
