
import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, Filter } from 'lucide-react';
import { SERVICES_DATA } from '../ServicesData';
import { Service, ServiceCategory, UserProfile } from '../types';

interface ServicesPageProps {
  user: UserProfile;
  // Fix: onServiceAction should return Promise<boolean> since wallet updates are async operations in App.tsx
  onServiceAction: (amount: number, serviceName: string) => Promise<boolean>;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ user, onServiceAction }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ServiceCategory | 'All'>('All');

  const categories = Object.values(ServiceCategory);

  const filteredServices = useMemo(() => {
    const term = search.toLowerCase();
    return SERVICES_DATA.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(term) || s.tags.some(t => t.toLowerCase().includes(term));
      const matchCat = activeTab === 'All' || s.category === activeTab;
      return matchSearch && matchCat;
    });
  }, [search, activeTab]);

  // Fix: handleServiceClick must be async to await the async onServiceAction call
  const handleServiceClick = async (service: Service) => {
    if (service.fee === 0) {
      window.open(service.url, '_blank');
      return;
    }

    const confirmPayment = window.confirm(`${service.name} के लिए ₹${service.fee} आपके वॉलेट से काटे जाएंगे। क्या आप जारी रखना चाहते हैं?`);
    if (confirmPayment) {
      // Fix: await the async onServiceAction call to get the actual boolean result
      const success = await onServiceAction(service.fee, service.name);
      if (success) {
        alert('भुगतान सफल! पोर्टल खोला जा रहा है।');
        window.open(service.url, '_blank');
      } else {
        alert('अपर्याप्त बैलेंस!');
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">सभी सेवाएँ ({SERVICES_DATA.length}+)</h2>
          <p className="text-gray-500 mt-2 font-medium">अपनी आवश्यकतानुसार किसी भी सरकारी या बैंकिंग पोर्टल का उपयोग करें।</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600" />
          <input 
            type="text" 
            placeholder="पैन, आधार, बैंक खोजें..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('All')}
          className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
            activeTab === 'All' 
            ? 'bg-blue-800 text-white border-blue-800 shadow-lg shadow-blue-500/20' 
            : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
          }`}
        >
          सब देखें
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
              activeTab === cat 
              ? 'bg-blue-800 text-white border-blue-800 shadow-lg shadow-blue-500/20' 
              : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
            }`}
          >
            {cat.split('(')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredServices.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className="bg-white group relative p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-between text-center min-h-[200px] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 active:scale-95"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center p-3 group-hover:bg-blue-50 transition-colors overflow-hidden">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${new URL(service.url).hostname}&sz=64`} 
                alt={service.name}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=gov.in&sz=64'; }}
              />
            </div>
            <div className="mt-4 flex-1">
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-900 leading-tight line-clamp-2">
                {service.name}
              </h3>
              <div className="mt-3 inline-block px-3 py-1 bg-orange-50 text-[10px] font-black text-orange-600 rounded-full border border-orange-100 uppercase tracking-tighter">
                FEE: ₹{service.fee}
              </div>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-4 h-4 text-blue-500" />
            </div>
          </button>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-gray-800">कोई सेवा नहीं मिली</h3>
          <p className="text-gray-400 text-sm mt-2">कृपया दूसरा कीवर्ड सर्च करें।</p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
