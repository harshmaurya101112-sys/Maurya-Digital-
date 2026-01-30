
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, ExternalLink, Landmark, Smartphone, FileText, Zap, 
  Globe, ShieldCheck, User, Briefcase, GraduationCap, Plane, 
  HeartPulse, ChevronRight, Lock, CheckCircle2, AlertCircle, X, Wallet, Monitor
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
  
  // Payment Modal State
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
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
    return base;
  }, []);

  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const launchService = (s: ServiceItem) => {
    setActiveService(s);
    setPayStatus('idle');
    setPayAmount('');
    setPayPin('');
    // Open official site in new window/tab
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
      await onAction(Number(payAmount), `Portal Payment: ${activeService?.name}`, 'debit', payPin);
      setPayStatus('success');
    } catch (e: any) {
      setErrorMsg(e.message || "भुगतान विफल");
      setPayStatus('error');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Portal Services</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">DIRECT ACCESS TO OFFICIAL GOVERNMENT SITES</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Search Service..." 
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {filtered.map(service => (
          <button 
            key={service.id}
            onClick={() => launchService(service)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col items-start text-left"
          >
            <div className={`${service.brandColor} text-white p-5 rounded-3xl w-fit mb-6 shadow-xl`}>
              {React.cloneElement(service.icon as React.ReactElement<any>, { size: 24 })}
            </div>
            <h3 className="font-black text-slate-900 text-sm mb-1 uppercase leading-tight">{service.name}</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{service.category}</p>
            <div className="mt-8 w-full flex items-center justify-between">
              <span className="text-[9px] font-black text-blue-600 uppercase">Open Site</span>
              <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Payment Overlay Modal */}
      {activeService && (
        <div className="fixed inset-0 z-[1000] bg-blue-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-3xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setActiveService(null)} className="absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-10">
              <div className={`${activeService.brandColor} text-white p-4 rounded-2xl shadow-lg`}>
                <Monitor size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-blue-950 uppercase leading-none">{activeService.name}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Website khul gayi hai, ab payment karein</p>
              </div>
            </div>

            {payStatus === 'success' ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-green-500/20 animate-bounce">
                  <CheckCircle2 size={40} />
                </div>
                <p className="font-black text-green-600 uppercase text-lg">भुगतान सफल!</p>
                <p className="text-xs font-bold text-slate-400">अब आप दूसरे टैब में अपना काम पूरा कर सकते हैं।</p>
                <button onClick={() => setActiveService(null)} className="bg-blue-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs">डैशबोर्ड पर जाएँ</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Your Wallet Balance</p>
                    <p className="text-xl font-black text-slate-900">₹{user.walletBalance.toLocaleString('hi-IN')}</p>
                  </div>
                  <Wallet className="text-blue-900" size={24} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount to Pay</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                    <input 
                      type="number" 
                      placeholder="Enter Amount" 
                      className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Security PIN</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="password" 
                      placeholder="••••" 
                      maxLength={6}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:border-blue-500"
                      value={payPin}
                      onChange={e => setPayPin(e.target.value)}
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase rounded-2xl border border-red-100 flex items-center gap-2">
                    <AlertCircle size={14} /> {errorMsg}
                  </div>
                )}

                <button 
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="w-full bg-blue-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 shadow-2xl transition-all"
                >
                  {isPaying ? "Processing..." : "Pay Now & Complete Transaction"}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
