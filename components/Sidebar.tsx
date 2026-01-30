
import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Wallet, 
  UserCircle, 
  ShieldCheck, 
  LogOut, 
  Monitor 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, isAdmin, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: <LayoutDashboard size={20} /> },
    { id: 'services', label: 'सेवाएं (200+)', icon: <Layers size={20} /> },
    { id: 'wallet', label: 'वॉलेट', icon: <Wallet size={20} /> },
    { id: 'profile', label: 'प्रोफाइल', icon: <UserCircle size={20} /> },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'एडमिन पैनल', icon: <ShieldCheck size={20} /> });
  }

  return (
    <aside className="hidden md:flex w-72 bg-blue-950 text-white flex-col border-r border-white/5 shadow-2xl z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
            <Monitor size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter leading-none">MAURYA</h1>
            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Digital Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                activePage === item.id 
                  ? 'bg-blue-800 text-white shadow-xl shadow-blue-900/50 scale-105' 
                  : 'text-blue-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={activePage === item.id ? 'text-orange-400' : ''}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          लॉगआउट करें
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
