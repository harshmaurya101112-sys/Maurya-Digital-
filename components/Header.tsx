
import React from 'react';
import { Search, Monitor, User } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-700 text-white p-2.5 rounded-lg shadow-inner">
            <Monitor className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-blue-900 tracking-tight leading-none">MAURYA PORTAL</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">Jan Seva Kendra - 2026</p>
          </div>
        </div>

        {/* Search Bar - Professional Integrated Style */}
        <div className="relative w-full md:max-w-xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="खोजें: Aadhaar, Bank, Bills, Result..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="h-8 w-px bg-gray-200 mx-2"></div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="w-4 h-4" />
            VLE लॉगिन
          </button>
          <button className="bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-800 hover:-translate-y-0.5 transition-all">
            नया रजिस्ट्रेशन
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
