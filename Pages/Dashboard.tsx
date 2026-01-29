
import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Layers, 
  ArrowUpRight, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Service } from '../types';
import { SERVICES_DATA } from '../ServicesData';

interface DashboardProps {
  user: UserProfile;
  onPageChange: (page: 'services' | 'wallet') => void;
  // Fix: onServiceAction should return Promise<boolean> since wallet updates are async operations in App.tsx
  onServiceAction: (amount: number, serviceName: string) => Promise<boolean>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onPageChange, onServiceAction }) => {
  const featuredServices = SERVICES_DATA.filter(s => s.featured).slice(0, 6);
  
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
        alert('अपर्याप्त बैलेंस! कृपया वॉलेट रिचार्ज करें।');
        onPageChange('wallet');
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-3">नमस्ते, {user.displayName.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100/80 font-medium leading-relaxed">
            मौर्य डिजिटल सेवा पोर्टल में स्वागत है। आपके वॉलेट में ₹{user.walletBalance} शेष हैं। आज 200+ सेवाओं का लाभ उठाएं।
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => onPageChange('wallet')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              पैसे जोड़ें (Add Money)
            </button>
            <button 
              onClick={() => onPageChange('services')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-2xl font-black text-sm border border-white/20 transition-all"
            >
              सभी सेवाएँ देखें
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Zap className="w-64 h-64 -mb-12 -mr-12" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'उपयोग की गई सेवाएँ', value: user.transactions.filter(t => t.type === 'debit').length, icon: <Layers />, color: 'blue' },
          { label: 'कुल लेनदेन', value: user.transactions.length, icon: <TrendingUp />, color: 'green' },
          { label: 'वॉलेट स्टेटस', value: user.walletBalance > 50 ? 'सुरक्षित' : 'कम बैलेंस', icon: <ShieldCheck />, color: user.walletBalance > 50 ? 'indigo' : 'orange' },
          { label: 'अंतिम लेनदेन', value: user.transactions[0]?.amount ? `₹${user.transactions[0].amount}` : 'N/A', icon: <ArrowUpRight />, color: 'slate' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center`}>
              {React.cloneElement(stat.icon as any, { className: 'w-7 h-7' })}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-gray-800 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Services */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
              लोकप्रिय सेवाएँ (Featured)
            </h3>
            <button 
              onClick={() => onPageChange('services')}
              className="text-sm font-black text-blue-700 hover:text-blue-900 flex items-center gap-1 group"
            >
              और देखें <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-500 transition-all text-left flex items-center justify-between group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center p-2 group-hover:bg-blue-50 transition-colors">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${new URL(service.url).hostname}&sz=64`} 
                      alt={service.name}
                      className="w-full h-full object-contain grayscale-[0.5] group-hover:grayscale-0"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-900">{service.name}</h4>
                    <p className="text-[10px] font-black text-orange-600 mt-1 uppercase">Fee: ₹{service.fee}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-800">ताज़ा लेनदेन</h3>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            {user.transactions.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {user.transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'debit' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                        {t.type === 'debit' ? '-' : '+'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{t.serviceName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{t.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-black ${t.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                      {t.type === 'debit' ? '-' : '+'}₹{t.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">कोई लेनदेन नहीं</p>
              </div>
            )}
            {user.transactions.length > 5 && (
              <button 
                onClick={() => onPageChange('wallet')}
                className="w-full py-4 text-xs font-black text-blue-600 hover:bg-blue-50 border-t border-gray-50 uppercase tracking-widest"
              >
                सभी देखें
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
