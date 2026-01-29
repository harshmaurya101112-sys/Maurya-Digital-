
import React from 'react';
import { User, Wallet, Bell, Search } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-4 sticky top-[40px] z-50 flex items-center justify-between shadow-sm">
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search services (Aadhar, PAN...)"
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">वॉलेट बैलेंस</span>
          <div className="flex items-center gap-1.5 text-blue-900 font-black text-lg">
            <span className="text-sm">₹</span>
            {user.walletBalance.toLocaleString('hi-IN')}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-black text-gray-800 leading-none">{user.displayName}</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1">VLE ID: {user.uid.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 ring-2 ring-blue-50">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
