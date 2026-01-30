import React from 'react';
import { UserProfile } from '../types';
import { CreditCard, ShieldCheck, FileText, Smartphone, Users, Zap, ArrowRight, Wallet } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onPageChange: (p: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onPageChange }) => {
  const actions = [
    { title: 'बैंकिंग सेवाएं', icon: <CreditCard />, color: 'bg-blue-600', page: 'services', desc: 'Aadhar Pay & DMT' },
    { title: 'सरकारी फॉर्म', icon: <FileText />, color: 'bg-orange-500', page: 'services', desc: 'PAN, Ayushman, E-Shram' },
    { title: 'रिचार्ज & बिल', icon: <Zap />, color: 'bg-purple-600', page: 'services', desc: 'Mobile & Utility' },
    { title: 'वॉलेट लोड', icon: <Wallet />, color: 'bg-green-600', page: 'wallet', desc: 'Add Funds to Portal' },
    { title: 'प्रोफाइल बदलें', icon: <ShieldCheck />, color: 'bg-slate-800', page: 'profile', desc: 'Edit Details' },
    { title: 'कस्टमर लिस्ट', icon: <Users />, color: 'bg-pink-600', page: 'admin', adminOnly: true, desc: 'Manage Users' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome & Balance Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-3">Welcome to Maurya Portal</p>
            <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter flex items-center gap-3">
              {user.displayName}
              {user.isAdmin && <span className="bg-orange-500 text-[10px] px-3 py-1 rounded-full border border-orange-400 shadow-lg">ADMIN</span>}
            </h1>
            <p className="text-blue-300/60 text-sm font-medium">Digital Solution for your Business</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="bg-white/10 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-white/20 shadow-inner group-hover:bg-white/15 transition-all">
              <p className="text-[10px] font-black uppercase text-blue-300 mb-2 tracking-widest text-right">Main Wallet Balance</p>
              <p className="text-4xl font-black tabular-nums">₹{user.walletBalance.toLocaleString('hi-IN')}</p>
            </div>
            <button onClick={() => onPageChange('wallet')} className="mt-4 flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-xl transition-all hover:scale-105">
              Add Money <ArrowRight size={14} />
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {actions.map((act, i) => (
          (!act.adminOnly || user.isAdmin) && (
            <button key={i} onClick={() => onPageChange(act.page)} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center gap-5 group text-left w-full">
              <div className={`${act.color} text-white p-5 rounded-[1.5rem] shadow-2xl group-hover:rotate-6 transition-transform group-hover:scale-110`}>
                {/* Fix: Cast to React.ReactElement<any> to resolve TypeScript error with 'size' prop in cloneElement */}
                {React.cloneElement(act.icon as React.ReactElement<any>, { size: 28 })}
              </div>
              <div className="text-center">
                <span className="block font-black text-slate-900 text-xs uppercase tracking-tight">{act.title}</span>
                <span className="block text-[8px] font-bold text-slate-400 uppercase mt-1">{act.desc}</span>
              </div>
            </button>
          )
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-blue-950 uppercase text-xs flex items-center gap-2">
              <Zap className="text-orange-500 w-4 h-4" /> Recent Transactions
            </h3>
            <button className="text-[10px] font-black text-blue-600 uppercase hover:underline" onClick={() => onPageChange('wallet')}>View Full History</button>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-100 border-dashed rounded-[2rem] p-10 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No recent records to show</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-900 p-10 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
          <h3 className="text-xs font-black uppercase mb-6 tracking-widest">News & Support</h3>
          <div className="space-y-6">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-orange-400 uppercase mb-1">Notice</p>
              <p className="text-xs font-medium leading-relaxed italic">"Pan Card service is now live with instant approval system."</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-blue-300 uppercase mb-1">Admin Help</p>
              <p className="text-xs font-medium">Contact WhatsApp: 91xxxxxxxxx for high balance requests.</p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px] translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;