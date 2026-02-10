
import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Search, ShieldCheck, Landmark, Zap, ChevronRight, X, Fingerprint, 
  HeartPulse, Globe, User, MapPin, Building2, FileCheck, Shield, Umbrella, Building, 
  CheckCircle2, Loader2, Key
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
  subServices: SubService[];
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [launchStep, setLaunchStep] = useState<'idle' | 'authorizing' | 'success'>('idle');

  const categories = ['All', 'Banking', 'Central Govt', 'UP Services', 'Bihar Services', 'Identity', 'Insurance', 'Utilities'];

  const allServices: ServiceItem[] = useMemo(() => {
    const base: ServiceItem[] = [
      // CENTRAL GOVT
      { 
        id: 'pan_nsdl', name: 'PAN NSDL Portal', icon: <User />, category: 'Central Govt', brandColor: 'bg-blue-800', desc: 'PAN Card Hub', 
        subServices: [
          {name: 'New Form 49A', url: 'https://www.onlineservices.nsdl.com/', desc: 'Apply New Individual'},
          {name: 'PAN Correction', url: 'https://www.onlineservices.nsdl.com/', desc: 'Name/DOB Change'},
          {name: 'Download e-PAN', url: 'https://www.onlineservices.nsdl.com/', desc: 'Digital Copy'}
        ]
      },
      { 
        id: 'uidai', name: 'Aadhar UIDAI', icon: <Fingerprint />, category: 'Identity', brandColor: 'bg-red-600', desc: 'UIDAI Official', 
        subServices: [
          {name: 'Address Update', url: 'https://myaadhaar.uidai.gov.in/', desc: 'Online Update'},
          {name: 'Aadhar Download', url: 'https://myaadhaar.uidai.gov.in/', desc: 'PDF Download'},
          {name: 'Verify Mobile', url: 'https://myaadhaar.uidai.gov.in/', desc: 'Check Linked Number'}
        ]
      },
      // UP SERVICES
      { 
        id: 'up_edistrict', name: 'UP e-District', icon: <Building />, category: 'UP Services', brandColor: 'bg-orange-600', desc: 'UP Government', 
        subServices: [
          {name: 'Caste Certificate', url: 'https://edistrict.up.gov.in/', desc: 'Apply Jati Praman'},
          {name: 'Income Certificate', url: 'https://edistrict.up.gov.in/', desc: 'Apply Aay Praman'},
          {name: 'Residential', url: 'https://edistrict.up.gov.in/', desc: 'Apply Niwas Praman'},
          {name: 'Shadi Anudan', url: 'http://shadianudan.upsdc.gov.in/', desc: 'Marriage Grant'}
        ]
      },
      // BIHAR SERVICES
      { 
        id: 'bihar_rtps', name: 'Bihar RTPS', icon: <FileCheck />, category: 'Bihar Services', brandColor: 'bg-emerald-700', desc: 'Service Plus Bihar', 
        subServices: [
          {name: 'Caste/Income', url: 'https://serviceonline.bihar.gov.in/', desc: 'Apply RTPS'},
          {name: 'Land Records', url: 'http://biharbhumi.bihar.gov.in/', desc: 'Bhulekh Bihar'},
          {name: 'LPC Certificate', url: 'http://biharbhumi.bihar.gov.in/', desc: 'Apply Land Possession'}
        ]
      },
    ];

    // Generate 50+ Banks
    const bankNames = ['SBI', 'PNB', 'HDFC', 'Axis', 'ICICI', 'BOB', 'Canara', 'Union', 'IDFC', 'IndusInd', 'Kotak', 'Yes Bank', 'Federal', 'UCO', 'Indian Bank', 'CBI', 'IOB', 'J&K Bank', 'Karnataka Bank', 'Punjab & Sind', 'Bandhan Bank', 'South Indian', 'RBL', 'CSB', 'DBS', 'HSBC', 'Standard Chartered', 'Citibank', 'Dhanlaxmi', 'Karur Vysya', 'Nainital Bank', 'Tamilnad Mercantile', 'DCB', 'City Union', 'SVC', 'Saraswat', 'Cosmos', 'TJSB', 'NKGSB', 'Kalupur', 'Abhyudaya', 'Janata Sahakari', 'GP Parsik', 'New India Bank', 'Apna Sahakari'];
    bankNames.forEach(bank => {
      base.push({
        id: `bank_${bank.toLowerCase()}`,
        name: `${bank} Netbanking`,
        icon: <Landmark />,
        category: 'Banking',
        brandColor: 'bg-blue-900',
        desc: `Secure Login for ${bank}`,
        subServices: [{name: 'Login Portal', url: '#', desc: 'Personal/Corp Access'}, {name: 'Reset Password', url: '#', desc: 'Account Recovery'}]
      });
    });

    // Generate 30+ Insurance Portals
    const insuranceNames = ['LIC', 'Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'New India Assurance', 'United India', 'Oriental', 'National Insurance', 'Max Life', 'SBI Life', 'TATA AIA', 'Reliance General', 'Care Health', 'Niva Bupa', 'Aditya Birla', 'Acko', 'Digit', 'Cholamandalam', 'Future Generali', 'IFFCO Tokio', 'Liberty', 'Magma HDI', 'Raheja QBE', 'Royal Sundaram', 'Universal Sompo', 'Zuno', 'Shriram General', 'Kotak General', 'Navi Insurance'];
    insuranceNames.forEach(ins => {
      base.push({
        id: `ins_${ins.toLowerCase().replace(' ', '_')}`,
        name: `${ins} Portal`,
        icon: <Umbrella />,
        category: 'Insurance',
        brandColor: 'bg-blue-700',
        desc: `Insurance Hub - ${ins}`,
        subServices: [{name: 'Premium Pay', url: '#', desc: 'Quick Renewal'}, {name: 'Policy Status', url: '#', desc: 'Check Validity'}]
      });
    });

    // Generate Utilities for All States (UPPCL, Tata, etc.)
    const utilities = ['UPPCL (Urban)', 'UPPCL (Rural)', 'PSPCL (Punjab)', 'DHBVN (Haryana)', 'UHBVN', 'Tata Power (Delhi)', 'BSES Yamuna', 'BSES Rajdhani', 'MSEB (Maharashtra)', 'GUVNL (Gujarat)', 'BESCOM (Karnataka)', 'TANGEDCO (TN)', 'KSEB (Kerala)', 'APDCL (Assam)', 'TPODL (Odisha)', 'PVVNL', 'MVVNL', 'DVVNL', 'PuVVNL', 'NPCL', 'Adani Power', 'Torrent Power', 'CESC', 'BEST', 'MSEDCL', 'MPPKVVCL', 'MPAKVVCL', 'CSPDCL', 'JBVNL', 'WBSEDCL', 'NBPDCL', 'SBPDCL', 'AEML', 'SNDL', 'Feedback Energy', 'India Power', 'DNHPDCL', 'PED Puducherry', 'APEPDCL', 'APSPDCL', 'TSSPDCL', 'TSNPDCL', 'PEED Manipur'];
    utilities.forEach(util => {
      base.push({
        id: `util_${util.toLowerCase().replace(/[\s()]/g, '_')}`,
        name: util,
        icon: <Zap />,
        category: 'Utilities',
        brandColor: 'bg-purple-600',
        desc: 'Electricity Bill Payment',
        subServices: [{name: 'Pay Bill', url: '#', desc: 'Instant Billdesk Bridge'}, {name: 'View History', url: '#', desc: 'Old Receipts'}]
      });
    });

    // Other State e-Districts (G2C Others)
    const otherStates = ['Delhi', 'MP', 'Rajasthan', 'Haryana', 'Punjab', 'WB', 'MH', 'GJ', 'TN', 'KA', 'KL', 'AS', 'OD', 'JH', 'UK', 'HP', 'CG', 'AP', 'TS', 'JK', 'Goa', 'Sikkim', 'Tripura', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Arunachal', 'Ladakh', 'Puducherry'];
    otherStates.forEach(st => {
      base.push({
        id: `edist_${st.toLowerCase()}`,
        name: `e-District ${st}`,
        icon: <Building />,
        category: 'G2C Others',
        brandColor: 'bg-slate-700',
        desc: `Services for ${st}`,
        subServices: [{name: 'Apply Services', url: '#', desc: 'Official Govt Portal'}, {name: 'Track Application', url: '#', desc: 'Check Status'}]
      });
    });

    return base;
  }, []);

  const filtered = allServices.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLaunch = (sub: SubService) => {
    setLaunchStep('authorizing');
    setTimeout(() => {
      setLaunchStep('success');
      setTimeout(() => {
        if (sub.url !== '#') window.open(sub.url, '_blank');
        setSelectedService(null);
        setLaunchStep('idle');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Search & Header */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tighter">Portal Hub</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={14} /> {allServices.length} Secure Gateways Online
          </p>
        </div>
        <div className="relative w-full md:w-[450px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            placeholder="Search 200+ portals..." 
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold text-base outline-none focus:border-blue-500 shadow-inner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-blue-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {filtered.map(service => (
          <div 
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer text-center relative overflow-hidden"
          >
            <div className={`mx-auto ${service.brandColor} text-white p-5 rounded-[1.5rem] mb-4 shadow-lg group-hover:rotate-6 transition-transform w-fit`}>
              {React.cloneElement(service.icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-tight line-clamp-1">{service.name}</h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Visit Portal</p>
          </div>
        ))}
      </div>

      {/* Portal Selection Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[1000] bg-blue-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-4xl animate-in zoom-in-95 relative">
            <button onClick={() => setSelectedService(null)} className="absolute top-10 right-10 p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500">
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
              <div className={`${selectedService.brandColor} lg:col-span-2 p-12 text-white flex flex-col justify-between`}>
                <div className="space-y-6">
                  <div className="bg-white/10 p-5 rounded-[1.5rem] w-fit backdrop-blur-md">
                    {React.cloneElement(selectedService.icon as React.ReactElement<any>, { size: 40 })}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight">{selectedService.name}</h2>
                  <p className="text-blue-100/60 font-bold text-[10px] uppercase tracking-widest">{selectedService.desc}</p>
                </div>
              </div>

              <div className="lg:col-span-3 p-12 overflow-y-auto max-h-[70vh] no-scrollbar">
                {launchStep === 'idle' ? (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Operation</h3>
                    {selectedService.subServices.map((sub, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleLaunch(sub)}
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-blue-950 transition-all"
                      >
                        <div className="text-left">
                           <p className="font-black text-slate-900 group-hover:text-white text-sm transition-colors">{sub.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 group-hover:text-white/60 uppercase">{sub.desc}</p>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-white" size={20} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                    {launchStep === 'authorizing' ? (
                      <>
                        <Loader2 className="w-20 h-20 text-blue-600 animate-spin" />
                        <h4 className="text-xl font-black text-blue-950 uppercase">Authorizing Node</h4>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                        <h4 className="text-xl font-black text-blue-950 uppercase">Bridge Established</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase animate-pulse">Redirecting to Secure Portal...</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
