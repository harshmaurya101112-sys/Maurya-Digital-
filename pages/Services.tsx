
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, ExternalLink, Landmark, Smartphone, FileText, Zap, 
  Globe, ShieldCheck, User, Briefcase, GraduationCap, Plane, 
  HeartPulse, BookOpen, Building2, Car, HardDrive,
  ChevronRight, Lock, CheckCircle2, AlertCircle, X, Shield, Wallet
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  url: string;
  brandColor: string;
  isGovernment: boolean;
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState<string>('');
  
  // Payment Overlay State
  const [payAmount, setPayAmount] = useState('');
  const [payPin, setPayPin] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [payStatus, setPayStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['All', 'Identity', 'Banking', 'State Services', 'Utilities', 'Travel', 'Education'];

  const allServices = useMemo(() => {
    const base: ServiceItem[] = [
      { id: 'i1', name: 'Aadhar Update', icon: <Smartphone />, category: 'Identity', url: 'https://myaadhaar.uidai.gov.in/', brandColor: 'bg-red-600', isGovernment: true },
      { id: 'i2', name: 'PAN Card (NSDL)', icon: <User />, category: 'Identity', url: 'https://www.onlineservices.nsdl.com/', brandColor: 'bg-orange-600', isGovernment: true },
      { id: 'i3', name: 'PAN Card (UTI)', icon: <User />, category: 'Identity', url: 'https://www.utiitsl.com/', brandColor: 'bg-orange-700', isGovernment: true },
      { id: 'i4', name: 'Voter ID Seva', icon: <ShieldCheck />, category: 'Identity', url: 'https://www.nvsp.in/', brandColor: 'bg-emerald-600', isGovernment: true },
      { id: 'i5', name: 'Passport Seva', icon: <Globe />, category: 'Identity', url: 'https://www.passportindia.gov.in/', brandColor: 'bg-blue-900', isGovernment: true },
      { id: 'b1', name: 'SBI Net Banking', icon: <Landmark />, category: 'Banking', url: 'https://onlinesbi.sbi/', brandColor: 'bg-blue-700', isGovernment: true },
      { id: 'g1', name: 'Ayushman Bharat', icon: <HeartPulse />, category: 'Health', url: 'https://setu.pmjay.gov.in/', brandColor: 'bg-green-600', isGovernment: true },
      { id: 'u1', name: 'UP Electricity', icon: <Zap />, category: 'Utilities', url: 'https://www.uppclonline.com/', brandColor: 'bg-yellow-600', isGovernment: true },
      { id: 't1', name: 'IRCTC Railway', icon: <Plane />, category: 'Travel', url: 'https://www.irctc.co.in/', brandColor: 'bg-blue-800', isGovernment: true },
    ];

    const states = ['UP', 'Bihar', 'Rajasthan', 'MP', 'Maharashtra', 'Gujarat'];
    const stateServices = [
      { name: 'e-District Portal', path: 'edistrict.gov.in' },
      { name: 'Ration Card', path: 'fcs.gov.in' },
      { name: 'Land Record', path: 'bhulekh.gov.in' }
    ];

    const extended: ServiceItem[] = [];
    states.forEach(state => {
      stateServices.forEach(srv => {
        extended.push({
          id: `ext-${state}-${srv.name.replace(/\s+/g, '-')}`,
          name: `${state} ${srv.name}`,
          icon: <FileText />,
          category: 'State Services',
          url: `https://${state.toLowerCase()}.${srv.path}`,
          brandColor: 'bg-slate-600',
          isGovernment: true
        });
      });
    });

    return [...base, ...extended];
  }, []);

  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const openBrowser = (s: ServiceItem) => {
    setBrowserUrl(s.url);
    setBrowserTitle(s.name);
    setPayStatus('idle');
    setPayAmount('');
    setPayPin('');
  };

  const handleOverlayPayment = async () => {
    if (!payAmount || Number(payAmount) <= 0) {
      setErrorMsg("Please enter valid amount");
      return;
    }
    setIsPaying(true);
    setErrorMsg('');
    try {
      await onAction(Number(payAmount), `Portal Pay: ${browserTitle}`, 'debit', payPin);
      setPayStatus('success');
      setTimeout(() => setPayStatus('idle'), 5000);
    } catch (e: any) {
      setErrorMsg(e.message || "Payment Failed");
      setPayStatus('error');
    } finally {
      setIsPaying(false);
    }
  };

  if (browserUrl) {
    return (
      <div className="fixed inset-0 z-[600] bg-white flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        {/* Browser Top Bar */}
        <div className="h-16 bg-blue-950 text-white flex items-center justify-between px-6 shadow-xl relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Shield size={18} />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-tight">{browserTitle}</h2>
              <p className="text-[8px] font-bold text-blue-300 uppercase tracking-widest">Official Government Portal Layer</p>
            </div>
          </div>
          <button 
            onClick={() => setBrowserUrl(null)}
            className="w-10 h-10 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Web Frame */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe 
            src={browserUrl} 
            className="w-full h-full border-none"
            title="Service Browser"
          />
          
          {/* Persistent Payment Bar (Floating Overlay) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-white/80 backdrop-blur-2xl border border-white/50 p-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-5 delay-300">
            <div className="flex items-center gap-4 border-r border-slate-200 pr-6 mr-2 shrink-0">
              <div className="bg-blue-900 p-3 rounded-2xl text-white">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Your Balance</p>
                <p className="text-sm font-black text-slate-900 leading-none">₹{user.walletBalance.toLocaleString('hi-IN')}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center gap-3 w-full">
              {payStatus === 'success' ? (
                <div className="flex-1 flex items-center gap-3 bg-green-500 text-white p-3 rounded-2xl animate-in zoom-in">
                  <CheckCircle2 size={20} />
                  <span className="text-[10px] font-black uppercase">Payment Successful! You can continue on the official site.</span>
                </div>
              ) : (
                <>
                  <div className="relative flex-1 w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                    <input 
                      placeholder="Amount to pay on site"
                      className="w-full pl-8 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                      type="number"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                    />
                  </div>
                  <div className="relative flex-1 w-full">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      placeholder="Security PIN"
                      className="w-full pl-10 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                      type="password"
                      maxLength={6}
                      value={payPin}
                      onChange={e => setPayPin(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleOverlayPayment}
                    disabled={isPaying}
                    className="bg-blue-900 hover:bg-black text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] shadow-lg flex items-center gap-2 shrink-0 transition-all disabled:opacity-50"
                  >
                    {isPaying ? "Processing..." : "Pay from Wallet"}
                    <ChevronRight size={14} />
                  </button>
                </>
              )}
            </div>

            {errorMsg && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 shadow-xl animate-bounce">
                <AlertCircle size={12} /> {errorMsg}
              </div>
            )}
          </div>
        </div>

        {/* Security Warning */}
        <div className="h-8 bg-slate-50 flex items-center justify-center gap-3 border-t border-slate-200">
          <Lock size={10} className="text-slate-400" />
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Safe Browsing Mode Active • Powered by Maurya Security Layer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter leading-none">Safe Services</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">BROWSE OFFICIAL SITES WITH WALLET PAYMENT SUPPORT</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search (Aadhar, PAN, Electricity)..." 
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {filtered.map(service => (
          <button 
            key={service.id}
            onClick={() => openBrowser(service)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col items-start text-left"
          >
            <div className={`${service.brandColor} text-white p-5 rounded-3xl w-fit mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
              {React.cloneElement(service.icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <h3 className="font-black text-slate-900 text-sm mb-1 uppercase leading-tight">{service.name}</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{service.category}</p>
            
            <div className="mt-8 w-full flex items-center justify-between gap-4">
              <span className="text-[10px] font-black text-slate-300 uppercase">External Official</span>
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-blue-900 group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
            {/* Tag */}
            <div className="absolute top-6 right-6 flex flex-col items-end">
              <span className="text-[7px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase mb-1">Pay with Wallet</span>
              {service.isGovernment && <span className="text-[7px] font-black bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full uppercase">Govt</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">How it Works?</h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Pehle official portal par form bharein. Jab payment ki baari aaye, 
            toh humare floating <b>Payment Bar</b> ka upyog karke wallet se pay karein. 
            Balance debit hone ke baad aapko official gateway par transaction ID use karni hogi.
          </p>
        </div>
        <div className="relative z-10 bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center gap-4">
          <div className="bg-green-500 p-3 rounded-xl"><ShieldCheck size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase">Security Check</p>
            <p className="text-xs font-bold">100% Encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
