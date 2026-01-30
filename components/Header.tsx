
import React from 'react';
import { UserProfile } from '../types';
import { Bell, Wallet, User, LogOut, Search } from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onPageChange, onLogout }) => {
  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="pl-12 pr-6 py-3 bg-slate-100 border-none rounded-2xl text-xs font-bold w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div 
          onClick={() => onPageChange('wallet')}
          className="flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-2xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors group"
        >
          <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
            <Wallet size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-blue-400 uppercase leading-none mb-0.5">Wallet</span>
            <span className="text-sm font-black text-blue-900 leading-none">₹{user.walletBalance.toLocaleString('hi-IN')}</span>
          </div>
        </div>

        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onPageChange('profile')}>
          <div className="flex flex-col items-end">
            <span className="text-xs font-black text-slate-900 leading-none mb-1">{user.displayName}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
              {user.isAdmin ? 'Master Admin' : 'Retailer Partner'}
            </span>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-blue-900 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:hidden"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
