
import React from 'react';
import { Monitor, LogOut, LayoutDashboard, Settings, User } from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-900 text-white flex flex-col p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <Monitor className="w-8 h-8 text-orange-400" />
          <span className="font-black text-xl tracking-tighter">MAURYA</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-3 w-full p-4 bg-white/10 rounded-xl font-bold transition-colors">
            <LayoutDashboard className="w-5 h-5" /> डैशबोर्ड
          </button>
          <button className="flex items-center gap-3 w-full p-4 hover:bg-white/5 rounded-xl font-bold transition-colors">
            <User className="w-5 h-5" /> प्रोफाइल
          </button>
          <button className="flex items-center gap-3 w-full p-4 hover:bg-white/5 rounded-xl font-bold transition-colors">
            <Settings className="w-5 h-5" /> सेटिंग्स
          </button>
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-3 w-full p-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-bold transition-colors"
        >
          <LogOut className="w-5 h-5" /> लॉगआउट
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-blue-950 uppercase">Maurya Dashboard</h2>
            <p className="text-gray-500 font-medium">स्वागत है, {user.name || user.email}!</p>
          </div>
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center font-black text-blue-800">
            {user.email.charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-1">कुल एक्टिविटी</p>
            <p className="text-3xl font-black text-blue-900">248</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-1">पेंडिंग टास्क</p>
            <p className="text-3xl font-black text-orange-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase mb-1">मैसेज</p>
            <p className="text-3xl font-black text-green-600">5</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 min-h-[300px]">
          <h3 className="font-black text-lg text-blue-950 mb-4">हालिया गतिविधियां</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-sm">सिस्टम अपडेट लॉग - {i}</p>
                  <p className="text-xs text-gray-400">10 मिनट पहले</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
