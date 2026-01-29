
import React from 'react';
import { 
  CreditCard, 
  Grid3X3, 
  LifeBuoy, 
  LogOut, 
  Monitor,
  LayoutDashboard,
  User,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activePage: 'dashboard' | 'services' | 'wallet' | 'profile' | 'admin';
  onPageChange: (page: 'dashboard' | 'services' | 'wallet' | 'profile' | 'admin') => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange, onLogout, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'wallet', label: 'मेरा वॉलेट', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'services', label: 'सभी सेवाएँ', icon: <Grid3X3 className="w-5 h-5" /> },
    { id: 'profile', label: 'प्रोफाइल', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 sticky top-[40px] h-[calc(100vh-40px)] p-6 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="bg-blue-800 text-white p-2 rounded-xl shadow-lg">
          <Monitor className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-black text-blue-900 leading-none">MAURYA</h1>
          <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">PORTAL V2</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as any)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
              activePage === item.id 
              ? 'bg-blue-800 text-white shadow-xl shadow-blue-500/20 translate-x-1' 
              : 'text-gray-500 hover:bg-slate-50 hover:text-blue-800'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        {isAdmin && (
          <button
            onClick={() => onPageChange('admin')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all mt-6 ${
              activePage === 'admin' 
              ? 'bg-orange-600 text-white shadow-xl shadow-orange-500/20 translate-x-1' 
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            ADMIN PANEL
          </button>
        )}
      </nav>

      <div className="pt-8 mt-8 border-t border-gray-100 space-y-2">
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-slate-50">
          <LifeBuoy className="w-5 h-5" />
          सहायता (Support)
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          लॉगआउट
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
