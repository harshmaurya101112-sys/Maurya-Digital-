
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Search, CreditCard, Landmark, Smartphone, FileText, Zap, ChevronRight, Lock } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  cost: number;
  category: string;
}

const ServicesPage: React.FC<{user: UserProfile, onAction: (amt: number, service: string, type: 'credit' | 'debit', pin: string) => void}> = ({ user, onAction }) => {
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [pin, setPin] = useState('');

  // Sample categorization for 200+ services
  const categories = ['Banking', 'Govt Forms', 'Utilities', 'Insurance', 'Educational'];
  
  const services: ServiceItem[] = [
    { id: '1', name: 'Aadhar Pay Withdrawal', icon: <Landmark />, cost: 0, category: 'Banking' },
    { id: '2', name: 'Instant Money Transfer (DMT)', icon: <CreditCard />, cost: 10, category: 'Banking' },
    { id: '3', name: 'PAN Card Registration', icon: <FileText />, cost: 107, category: 'Govt Forms' },
    { id: '4', name: 'Mobile Recharge', icon: <Smartphone />, cost: 0, category: 'Utilities' },
    { id: '5', name: 'Electricity Bill Pay', icon: <Zap />, cost: 0, category: 'Utilities' },
    { id: '6', name: 'Ayushman Card Print', icon: <FileText />, cost: 15, category: 'Govt Forms' },
    // Imagine 200 more here...
  ];

  const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const handlePurchase = () => {
    if (!selectedService) return;
    if (user.walletBalance < selectedService.cost) return alert("वॉलेट में बैलेंस कम है!");
    if (user.walletPin && !pin) return alert("कृपया अपना वॉलेट पिन डालें!");
    
    onAction(selectedService.cost, selectedService.name, 'debit', pin);
    setSelectedService(null);
    setPin('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tight">Maurya Storefront</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">200+ Professional Services</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Search services (PAN, Aadhar, Bills...)" 
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm font-bold text-sm outline-none focus:border-blue-500 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(service => (
          <button 
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group text-left"
          >
            <div className="bg-blue-50 text-blue-600 p-5 rounded-3xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {React.cloneElement(service.icon as React.ReactElement, { size: 28 })}
            </div>
            <h3 className="font-black text-slate-900 text-sm mb-1 uppercase leading-tight">{service.name}</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">{service.category}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-blue-900">₹{service.cost}</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <ChevronRight size={16} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Purchase Dialog */}
      {selectedService && (
        <div className="fixed inset-0 z-[500] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="text-center mb-8">
              <div className="bg-orange-100 text-orange-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                {selectedService.icon}
              </div>
              <h2 className="text-2xl font-black text-blue-950 uppercase tracking-tight">{selectedService.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Confirm Service Purchase</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl mb-8 flex justify-between items-center">
              <span className="text-xs font-black text-slate-500 uppercase">Service Cost</span>
              <span className="text-xl font-black text-slate-900">₹{selectedService.cost}</span>
            </div>

            {user.walletPin && (
              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} /> Wallet Transaction PIN
                </label>
                <input 
                  type="password" 
                  maxLength={6}
                  placeholder="Enter 4-6 Digit PIN" 
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-center font-black text-2xl tracking-[1em] outline-none focus:border-blue-500"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setSelectedService(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
              <button onClick={handlePurchase} className="flex-1 py-4 bg-blue-900 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl shadow-blue-900/20">Pay Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
