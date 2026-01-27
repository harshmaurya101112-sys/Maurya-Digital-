
import React, { useState, useMemo } from 'react';
import { Search, Flashlight, User, Home as HomeIcon, History, Bell, Menu } from 'lucide-react';
import { ALL_SERVICES, CATEGORIES } from './constants';
import CategorySection from './components/CategorySection';
import ServiceCard from './components/ServiceCard';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return ALL_SERVICES;
    const query = searchQuery.toLowerCase();
    return ALL_SERVICES.filter(service => 
      service.name.toLowerCase().includes(query) || 
      service.cat.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto bg-gray-50 pb-24 shadow-2xl shadow-gray-200">
      {/* Header Section */}
      <header className="bg-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-inner transform rotate-12">
              <Flashlight className="w-5 h-5 text-orange-600 fill-orange-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none uppercase italic">Maurya Digital</h1>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-0.5">CSC & E-Mitra Hub</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button className="p-2.5 hover:bg-orange-500 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-orange-600"></span>
            </button>
            <button className="p-2.5 hover:bg-orange-500 rounded-xl transition-all">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar container */}
        <div className="px-4 pb-6 pt-1">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
            <input
              type="text"
              placeholder="सेवा खोजें (आधार, पैन, बिजली बिल...)"
              className="block w-full pl-12 pr-4 py-4 bg-white text-gray-900 border-none rounded-2xl shadow-xl focus:ring-4 focus:ring-orange-500/20 text-sm font-medium transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-2 mt-4 space-y-2">
        {searchQuery ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-2">
            <h2 className="text-xs font-black text-gray-400 mb-4 px-2 uppercase tracking-widest flex items-center gap-2">
              खोज के परिणाम <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{filteredServices.length}</span>
            </h2>
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-6 gap-x-2">
              {filteredServices.map((service, index) => (
                <ServiceCard key={`${service.name}-${index}`} service={service} />
              ))}
              {filteredServices.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-400 w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-bold">कोई सेवा नहीं मिली</p>
                  <button onClick={() => setSearchQuery('')} className="text-orange-600 text-xs font-bold mt-2 underline">सभी सेवाएँ देखें</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          CATEGORIES.map((category, idx) => (
            <div key={category.code} className={`animate-in fade-in slide-in-from-bottom-4 duration-500`} style={{ animationDelay: `${idx * 100}ms` }}>
              <CategorySection 
                category={category}
                services={ALL_SERVICES.filter(s => s.cat === category.code)}
              />
            </div>
          ))
        )}

        {/* Support Banner (Only on Home) */}
        {!searchQuery && (
          <div className="px-2 mt-6 mb-4">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-black mb-1">विशेष सहायता?</h3>
                <p className="text-xs opacity-90 mb-4 leading-relaxed max-w-[220px]">अगर आपको कोई सेवा नहीं मिल रही है तो हमारे प्रतिनिधि से बात करें।</p>
                <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl text-xs font-black shadow-lg active:scale-95 transition-transform flex items-center gap-2">
                  कॉल करें
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <User className="absolute right-6 top-1/2 -translate-y-1/2 w-20 h-20 text-white/10" />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center py-3 px-4 z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${activeTab === 'home' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}
        >
          <HomeIcon className={`w-6 h-6 ${activeTab === 'home' ? 'fill-orange-600/10' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">होम</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${activeTab === 'history' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-tighter">लेनदेन</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${activeTab === 'profile' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}
        >
          <User className={`w-6 h-6 ${activeTab === 'profile' ? 'fill-orange-600/10' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-tighter">प्रोफाइल</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
