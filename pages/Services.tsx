
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, ShieldCheck, Landmark, Zap, ChevronRight, Lock, 
  CheckCircle2, X, Fingerprint, 
  Briefcase, HeartPulse, Globe, User, Receipt, MapPin, 
  Building2, CreditCard, ExternalLink, Copy, Check,
  FileCheck, Gavel, Car, Plane, Loader2, Key, BookOpen, 
  Shield, Truck, Phone, Wifi, Droplets, Tv, LifeBuoy
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
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeSub, setActiveSub] = useState<SubService | null>(null);
  const [launchStep, setLaunchStep] = useState<'idle' | 'authorizing' | 'success'>('idle');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const categories = ['All', 'Banking', 'G2C UP', 'G2C Bihar', 'Identity', 'Central', 'Utilities', 'Travel'];

  const allServices: ServiceItem[] = useMemo(() => [
    // --- G2C UTTAR PRADESH ---
    { 
      id: 'up_edistrict', 
      name: 'UP e-District', 
      icon: <Building2 />, 
      category: 'G2C UP', 
      brandColor: 'bg-orange-600', 
      desc: 'Caste, Income, Domicile',
      subServices: [
        { name: 'Income Certificate (आय)', url: 'https://edistrict.up.gov.in/', desc: 'Direct SSO Bridge' },
        { name: 'Caste Certificate (जाति)', url: 'https://edistrict.up.gov.in/', desc: 'Direct SSO Bridge' },
        { name: 'Domicile (निवास)', url: 'https://edistrict.up.gov.in/', desc: 'Direct SSO Bridge' },
        { name: 'Birth Certificate', url: 'https://edistrict.up.gov.in/', desc: 'Urban/Rural' },
        { name: 'Death Certificate', url: 'https://edistrict.up.gov.in/', desc: 'Registration' }
      ]
    },
    { id: 'up_bhulekh', name: 'UP Bhulekh', icon: <MapPin />, category: 'G2C UP', brandColor: 'bg-orange-500', desc: 'Land Records', subServices: [{ name: 'Khasra/Khatauni', url: 'https://upbhulekh.gov.in/', desc: 'Land Record Verification' }] },
    
    // --- IDENTITY SERVICES ---
    { 
      id: 'pan_portal', 
      name: 'PAN Card Portal', 
      icon: <User />, 
      category: 'Identity', 
      brandColor: 'bg-blue-800', 
      desc: 'NSDL & UTI Bridge',
      subServices: [
        { name: 'NSDL New PAN (49A)', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', desc: 'Direct Form' },
        { name: 'UTI PAN Correction', url: 'https://www.utiitsl.com/', desc: 'Correction Bridge' },
        { name: 'Instant e-PAN', url: 'https://www.incometax.gov.in/', desc: 'Aadhar Based' }
      ]
    },
    { 
      id: 'aadhar_hub', 
      name: 'Aadhar Service', 
      icon: <Fingerprint />, 
      category: 'Identity', 
      brandColor: 'bg-red-600', 
      desc: 'UIDAI Enterprise',
      subServices: [
        { name: 'Address Update', url: 'https://myaadhaar.uidai.gov.in/', desc: 'Online Update' },
        { name: 'Download Aadhar', url: 'https://myaadhaar.uidai.gov.in/', desc: 'PDF Download' },
        { name: 'Verify Aadhar', url: 'https://myaadhaar.uidai.gov.in/', desc: 'Status Check' }
      ]
    },
    { id: 'voter_id', name: 'Voter Portal', icon: <Shield />, category: 'Identity', brandColor: 'bg-cyan-700', desc: 'NVSP Services', subServices: [{ name: 'New Registration', url: 'https://www.nvsp.in/', desc: 'Form 6' }] },

    // --- BANKING & AEPS ---
    { 
      id: 'aeps_bank', 
      name: 'Aadhar Pay (AEPS)', 
      icon: <Landmark />, 
      category: 'Banking', 
      brandColor: 'bg-emerald-600', 
      desc: 'Cash Withdrawal & Mini Statement',
      subServices: [
        { name: 'Balance Inquiry', url: '#', desc: 'Secure AEPS Bridge' },
        { name: 'Cash Withdrawal', url: '#', desc: 'Biometric Login' },
        { name: 'Mini Statement', url: '#', desc: 'Last 10 Txns' }
      ]
    },
    { id: 'dmt_transfer', name: 'Money Transfer (DMT)', icon: <CreditCard />, category: 'Banking', brandColor: 'bg-blue-900', desc: 'Instant IMPS/NEFT', subServices: [{ name: 'Send Money', url: '#', desc: 'All Banks Supported' }] },

    // --- CENTRAL SERVICES ---
    { id: 'passport_seva', name: 'Passport Seva', icon: <Globe />, category: 'Central', brandColor: 'bg-blue-950', desc: 'Govt. of India', subServices: [{ name: 'Apply Passport', url: 'https://www.passportindia.gov.in/', desc: 'New/Reissue' }] },
    { id: 'eshram_card', name: 'E-Shram Card', icon: <Briefcase />, category: 'Central', brandColor: 'bg-orange-700', desc: 'Unorganized Sector', subServices: [{ name: 'Self Registration', url: 'https://eshram.gov.in/', desc: 'UAN Card' }] },
    { id: 'ayushman_bharat', name: 'Ayushman Card', icon: <HeartPulse />, category: 'Central', brandColor: 'bg-red-500', desc: 'Health Insurance', subServices: [{ name: 'Apply Ayushman', url: 'https://setu.pmjay.gov.in/', desc: 'PMJAY Beneficiary' }] },

    // --- UTILITIES & BILLS ---
    { id: 'bbps_utility', name: 'Bill Payment (BBPS)', icon: <Zap />, category: 'Utilities', brandColor: 'bg-purple-700', desc: 'Electricity & Gas', subServices: [{ name: 'Electricity Bill', url: 'https://www.billdesk.com/', desc: 'All States' }] },
    { id: 'mobile_recharge', name: 'Recharge Hub', icon: <Phone />, category: 'Utilities', brandColor: 'bg-pink-600', desc: 'Prepaid/DTH', subServices: [{ name: 'Mobile Recharge', url: '#', desc: 'Instant Commission' }] },

    // --- TRAVEL ---
    { id: 'irctc_bridge', name: 'IRCTC Booking', icon: <Plane />, category: 'Travel', brandColor: 'bg-blue-600', desc: 'Rail Ticket Agent', subServices: [{ name: 'Book Ticket', url: 'https://www.irctc.co.in/', desc: 'Agent Login' }] },
    { id: 'fastag_recharge', name: 'FASTag Service', icon: <Truck />, category: 'Travel', brandColor: 'bg-slate-700', desc: 'Vehicle Toll', subServices: [{ name: 'Recharge FASTag', url: '#', desc: 'Instant Update' }] }
  ], []);

  // Filter Logic for 200+ list support
  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLaunchBridge = (sub: SubService) => {
    setActiveSub(sub);
    setLaunchStep('authorizing');
    
    // Improved Deep Link Simulation
    setTimeout(() => {
      const creds = user.serviceCredentials?.[selectedService?.id || ''];
      if (creds) {
        try {
           navigator.clipboard.writeText(creds.id);
        } catch (err) {
           console.warn("Clipboard failed, manual copy required.");
        }
      }
      setLaunchStep('success');
      
      // Fixed window open logic with error handling
      setTimeout(() => {
        if (sub.url && sub.url !== '#') {
          const newWindow = window.open(sub.url, '_blank', 'noopener,noreferrer');
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
             alert("Popup Blocked! Please allow popups for digitalmaurya.in to open the portal automatically.");
          }
        }
        setSelectedService(null);
        setActiveSub(null);
        setLaunchStep('idle');
      }, 2500);
    }, 1500);
  };

  const currentCreds = selectedService ? user.serviceCredentials?.[selectedService.id] : null;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Header with Search */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Merchant Service Hub</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={14} /> Global Enterprise Node Active
          </p>
        </div>
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            placeholder="Find portal (e.g. PAN, e-District)..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-base outline-none focus:border-blue-500 shadow-inner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:text-blue-900'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {filtered.length > 0 ? filtered.map(service => (
          <div 
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer text-center relative overflow-hidden"
          >
            <div className={`mx-auto ${service.brandColor} text-white p-5 rounded-[1.5rem] mb-4 shadow-lg group-hover:scale-110 transition-transform w-fit`}>
              {React.cloneElement(service.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-tight line-clamp-1">{service.name}</h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Start Bridge</p>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={32} />
             </div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching portals found</p>
          </div>
        )}
      </div>

      {/* Bridge Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[1000] bg-blue-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-4xl animate-in zoom-in-95 relative">
            <button onClick={() => { setSelectedService(null); setActiveSub(null); setLaunchStep('idle'); }} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500">
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
              <div className={`${selectedService.brandColor} lg:col-span-2 p-12 text-white flex flex-col justify-between`}>
                <div className="space-y-6">
                  <div className="bg-white/10 p-5 rounded-[1.5rem] w-fit backdrop-blur-md">
                    {React.cloneElement(selectedService.icon as React.ReactElement<any>, { size: 40 })}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">{selectedService.name}</h2>
                  <p className="text-blue-100/60 font-bold text-[10px] uppercase tracking-widest leading-relaxed">Secure SSO Bridge protocol v4.2 active. Credentials will be injected via clipboard.</p>
                </div>
                
                {currentCreds ? (
                  <div className="bg-black/20 p-6 rounded-[2rem] border border-white/10 space-y-4">
                    <p className="text-[9px] font-black uppercase text-blue-200 tracking-widest">Auth Credentials</p>
                    <div className="space-y-2">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold">{currentCreds.id}</span>
                        <button onClick={() => { navigator.clipboard.writeText(currentCreds.id); setCopiedField('id'); setTimeout(() => setCopiedField(null), 2000); }} className="p-2 bg-white/10 rounded-lg">
                          {copiedField === 'id' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold">••••••••</span>
                        <button onClick={() => { navigator.clipboard.writeText(currentCreds.pass); setCopiedField('pw'); setTimeout(() => setCopiedField(null), 2000); }} className="p-2 bg-white/10 rounded-lg">
                          {copiedField === 'pw' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-500/20 p-6 rounded-[2rem] border border-orange-500/20">
                    <p className="text-[9px] font-black uppercase text-orange-300 tracking-widest mb-1">Guest Bridge</p>
                    <p className="text-[10px] font-bold">No saved credentials for this node. Manual login required.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 p-12 overflow-y-auto max-h-[70vh] no-scrollbar">
                {activeSub ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in slide-in-from-right">
                    {launchStep === 'authorizing' ? (
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <Key className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                        </div>
                        <h4 className="text-xl font-black text-blue-950 uppercase">Securing Bridge</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Initalizing Secure Handshake...</p>
                      </div>
                    ) : (
                      <div className="space-y-6 w-full">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl">
                          <CheckCircle2 size={40} />
                        </div>
                        <h4 className="text-xl font-black text-blue-950 uppercase">Bridge Ready</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase px-8">Portal opening in new tab. Simply Paste (Ctrl+V) credentials from panel.</p>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 animate-[bridge_2.5s_linear]"></div>
                        </div>
                        <button onClick={() => window.open(activeSub.url, '_blank')} className="text-blue-600 text-[10px] font-black uppercase underline">Click here if portal doesn't open</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Available Entry Points</h3>
                    {selectedService.subServices?.map((sub, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleLaunchBridge(sub)}
                        className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-blue-950 transition-all hover:shadow-lg"
                      >
                        <div className="text-left flex items-center gap-4">
                           <div className="bg-white p-4 rounded-xl group-hover:bg-blue-800 transition-colors">
                             <ExternalLink className="text-blue-600 group-hover:text-white" size={20} />
                           </div>
                           <div>
                            <p className="font-black text-slate-900 group-hover:text-white text-base transition-colors">{sub.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 group-hover:text-white/60 uppercase">{sub.desc}</p>
                           </div>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-white" size={24} />
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
