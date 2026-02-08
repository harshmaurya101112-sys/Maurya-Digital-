
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, ShieldCheck, Landmark, Zap, ChevronRight, Lock, 
  CheckCircle2, AlertCircle, X, Wallet, Monitor, Fingerprint, 
  Briefcase, HeartPulse, Globe, User, Receipt, MapPin, 
  Building2, CreditCard, ArrowRight, ExternalLink, Copy, Check,
  Sticker, FileCheck, Landmark as BankIcon, Gavel, Car, Plane, Loader2, Key
} from 'lucide-react';

interface SubService {
  name: string;
  url: string;
  desc: string;
}

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  brandColor: string;
  desc: string;
  subServices?: SubService[];
  directUrl?: string;
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeSub, setActiveSub] = useState<SubService | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStep, setLaunchStep] = useState<'idle' | 'authorizing' | 'success'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const categories = ['All', 'Identity', 'UP G2C', 'Bihar G2C', 'Banking', 'Central', 'Utilities'];

  const allServices = useMemo(() => [
    { 
      id: 'up_edistrict', 
      name: 'UP e-District Hub', 
      icon: <Building2 />, 
      category: 'UP G2C', 
      brandColor: 'bg-orange-600', 
      desc: 'Government SSO Bridge',
      subServices: [
        { name: 'Income Certificate (आय प्रमाण पत्र)', url: 'https://edistrict.up.gov.in/edistrictup/public/login.aspx', desc: 'Direct SSO Link' },
        { name: 'Caste Certificate (जाति प्रमाण पत्र)', url: 'https://edistrict.up.gov.in/edistrictup/public/login.aspx', desc: 'Direct SSO Link' },
        { name: 'Domicile (निवास प्रमाण पत्र)', url: 'https://edistrict.up.gov.in/edistrictup/public/login.aspx', desc: 'Direct SSO Link' },
      ]
    },
    { 
      id: 'pan_portal', 
      name: 'PAN Portal (NSDL/UTI)', 
      icon: <User />, 
      category: 'Identity', 
      brandColor: 'bg-blue-800', 
      desc: 'PAN Card Merchant Bridge',
      subServices: [
        { name: 'New PAN Card (Individual)', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', desc: 'Form 49A Portal' },
        { name: 'PAN Correction Hub', url: 'https://www.utiitsl.com/pan/', desc: 'UTI Service Portal' }
      ]
    },
    { 
      id: 'aadhar_hub', 
      name: 'Aadhar Enterprise', 
      icon: <Fingerprint />, 
      category: 'Identity', 
      brandColor: 'bg-red-600', 
      desc: 'UIDAI Direct Bridge',
      subServices: [
        { name: 'Aadhar Address Update', url: 'https://myaadhaar.uidai.gov.in/', desc: 'Biometric SSO' },
        { name: 'Aadhar PVC Card Order', url: 'https://myaadhaar.uidai.gov.in/', desc: 'Digital Delivery' }
      ]
    }
  ], []);

  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLaunchBridge = (sub: SubService) => {
    setActiveSub(sub);
    setLaunchStep('authorizing');
    
    // Simulate Smart Bridge Authorization
    setTimeout(() => {
      const creds = user.serviceCredentials?.[selectedService?.id || ''];
      if (creds) {
        navigator.clipboard.writeText(creds.id);
      }
      setLaunchStep('success');
      
      // Auto-open government portal
      setTimeout(() => {
        window.open(sub.url, '_blank');
        setSelectedService(null);
        setActiveSub(null);
        setLaunchStep('idle');
      }, 3000);
    }, 1500);
  };

  const currentCreds = selectedService ? user.serviceCredentials?.[selectedService.id] : null;

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">CSC Smart Bridge</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={14} /> Zero-Click Merchant SSO Environment
          </p>
        </div>
        <div className="relative w-full md:w-[500px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            placeholder="Search service to bridge..." 
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-lg outline-none focus:border-blue-500 shadow-inner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:text-blue-900'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(service => (
          <div 
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all group cursor-pointer border-b-[6px] hover:border-blue-600"
          >
            <div className={`${service.brandColor} text-white p-8 rounded-[2.5rem] mb-8 shadow-4xl group-hover:rotate-6 transition-transform`}>
              {React.cloneElement(service.icon as React.ReactElement<any>, { size: 40 })}
            </div>
            <h3 className="font-black text-slate-900 text-base uppercase tracking-tight mb-2">{service.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect Bridge Now</p>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-[1000] bg-blue-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl rounded-[5rem] overflow-hidden shadow-4xl animate-in zoom-in-95 relative">
            <button onClick={() => { setSelectedService(null); setActiveSub(null); setLaunchStep('idle'); }} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500">
              <X size={28} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
              <div className={`${selectedService.brandColor} lg:col-span-2 p-16 text-white flex flex-col justify-between`}>
                <div className="space-y-6">
                  <div className="bg-white/10 p-6 rounded-[2rem] w-fit backdrop-blur-md">
                    {React.cloneElement(selectedService.icon as React.ReactElement<any>, { size: 50 })}
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">{selectedService.name}</h2>
                  <p className="text-blue-100/60 font-bold text-xs uppercase tracking-widest leading-relaxed">Bridge will auto-copy ID. Simply paste on portal, enter CAPTCHA/OTP to finish.</p>
                </div>
                
                {currentCreds ? (
                  <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                    <p className="text-[10px] font-black uppercase text-blue-200 tracking-[0.3em]">Credentials Hub</p>
                    <div className="space-y-3">
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group/id">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-white/40">Portal Login ID</span>
                          <span className="text-sm font-mono font-bold tracking-wider">{currentCreds.id}</span>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(currentCreds.id); setCopiedField('id'); setTimeout(() => setCopiedField(null), 2000); }} className="p-3 bg-white/10 rounded-xl hover:bg-orange-500 transition-colors">
                          {copiedField === 'id' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-white/40">Portal Password</span>
                          <span className="text-sm font-mono font-bold tracking-wider">••••••••</span>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(currentCreds.pass); setCopiedField('pw'); setTimeout(() => setCopiedField(null), 2000); }} className="p-3 bg-white/10 rounded-xl hover:bg-orange-500 transition-colors">
                          {copiedField === 'pw' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/10 p-8 rounded-[2.5rem] border border-red-500/20">
                    <p className="text-[9px] font-black uppercase text-red-300 tracking-widest mb-2">No Bridge Profile</p>
                    <p className="text-[10px] font-bold">Admin hasn't assigned your credentials yet. Direct SSO might not work.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 p-16 overflow-y-auto max-h-[70vh] no-scrollbar">
                {activeSub ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in slide-in-from-right">
                    {launchStep === 'authorizing' && (
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <Key className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
                        </div>
                        <h4 className="text-2xl font-black text-blue-950 uppercase">Authorizing Bridge</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connecting to Enterprise Gov Node...</p>
                      </div>
                    )}

                    {launchStep === 'success' && (
                      <div className="space-y-8 w-full">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-4xl animate-bounce">
                          <CheckCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-2xl font-black text-blue-950 uppercase tracking-tighter">Login ID Copied!</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase px-12">Opening Portal... Just Paste (Ctrl+V) the ID, then copy Password from the panel and enter CAPTCHA.</p>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 animate-[bridge_3s_linear]"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Sub-Service Entry</h3>
                       <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100">Smart Bridge v2.0</div>
                    </div>
                    {selectedService.subServices?.map((sub, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleLaunchBridge(sub)}
                        className="w-full p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:bg-blue-950 transition-all hover:shadow-2xl hover:scale-[1.02]"
                      >
                        <div className="text-left flex items-center gap-6">
                           <div className="bg-white p-5 rounded-2xl group-hover:bg-blue-800 transition-colors shadow-sm">
                             <ExternalLink className="text-blue-600 group-hover:text-white" size={24} />
                           </div>
                           <div>
                            <p className="font-black text-slate-900 group-hover:text-white text-lg transition-colors">{sub.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 uppercase mt-1">One-Click Deep Link</p>
                           </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-white transition-all" size={28} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bridge {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
